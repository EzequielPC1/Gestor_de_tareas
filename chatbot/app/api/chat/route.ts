import { NextRequest } from "next/server";
import { z } from "zod";
import { streamText, tool } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const DEMO_USER_ID = "demo-user";

function sanitize(str?: string | null) {
  if (!str) return undefined;
  return str.replace(/<\/?script.*?>/gi, "").trim();
}

// ===========================
// VALIDACIÓN
// ===========================
const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
});

const BodySchema = z.object({
  messages: z.array(MessageSchema),
});

// ===========================
// OPENROUTER
// ===========================
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: process.env.OPENROUTER_BASE_URL!,
});

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY!;

// ===========================
// TOOLS (COMPLETAS Y TIPADAS)
// ===========================

// 1) searchBooks
const searchBooksTool = tool({
  description: "Buscar libros en Google Books",
  parameters: z.object({
    query: z.string(),
    maxResults: z.number().default(10),
  }),
  async execute(
    {
      query,
      maxResults,
    }: {
      query: string;
      maxResults: number;
    }
  ) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      query
    )}&maxResults=${maxResults}&key=${GOOGLE_BOOKS_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    return (data.items ?? []).map((item: any) => ({
      id: item.id,
      title: item.volumeInfo?.title,
      authors: item.volumeInfo?.authors ?? [],
      thumbnail: item.volumeInfo?.imageLinks?.thumbnail ?? null,
    }));
  },
});

// 2) getBookDetails
const getBookDetailsTool = tool({
  description: "Obtiene información detallada de un libro.",
  parameters: z.object({
    bookId: z.string(),
  }),
  async execute({ bookId }: { bookId: string }) {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${GOOGLE_BOOKS_API_KEY}`
    );
    const item = await res.json();
    const info = item.volumeInfo ?? {};

    return {
      id: bookId,
      title: info.title,
      authors: info.authors ?? [],
      description: info.description ?? "",
      pages: info.pageCount ?? null,
      categories: info.categories ?? [],
      image: info.imageLinks ?? null,
    };
  },
});

// 3) addToReadingList
const addToReadingListTool = tool({
  description: "Agrega un libro a tu lista de lectura.",
  parameters: z.object({
    bookId: z.string(),
    priority: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
    notes: z.string().optional(),
  }),
  async execute(
    {
      bookId,
      priority,
      notes,
    }: {
      bookId: string;
      priority: "HIGH" | "MEDIUM" | "LOW";
      notes?: string;
    }
  ) {
    const cleanNotes = sanitize(notes);

    await prisma.user.upsert({
      where: { id: DEMO_USER_ID },
      create: { id: DEMO_USER_ID, name: "Demo User" },
      update: {},
    });

    const item = await prisma.readingListItem.upsert({
      where: { userId_bookId: { userId: DEMO_USER_ID, bookId } },
      create: { userId: DEMO_USER_ID, bookId, priority, notes: cleanNotes },
      update: { priority, notes: cleanNotes },
    });

    return { success: true, item };
  },
});

// 4) getReadingList
const getReadingListTool = tool({
  description: "Obtiene la lista de lectura.",
  parameters: z.object({
    limit: z.number().default(20),
  }),
  async execute({ limit }: { limit: number }) {
    return prisma.readingListItem.findMany({
      where: { userId: DEMO_USER_ID },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  },
});

// 5) markAsRead
const markAsReadTool = tool({
  description: "Marca un libro como leído.",
  parameters: z.object({
    bookId: z.string(),
    rating: z.number().min(1).max(5).optional(),
    review: z.string().optional(),
  }),
  async execute(
    {
      bookId,
      rating,
      review,
    }: {
      bookId: string;
      rating?: number;
      review?: string;
    }
  ) {
    const clean = sanitize(review);

    const finished = await prisma.finishedBook.create({
      data: {
        userId: DEMO_USER_ID,
        bookId,
        rating,
        review: clean,
      },
    });

    await prisma.readingListItem.deleteMany({
      where: { userId: DEMO_USER_ID, bookId },
    });

    return { success: true, finished };
  },
});

// 6) getReadingStats
const getReadingStatsTool = tool({
  description: "Devuelve estadísticas de lectura.",
  parameters: z.object({
    period: z.enum(["all-time", "year", "month"]).default("all-time"),
  }),
  async execute() {
    const books = await prisma.finishedBook.findMany({
      where: { userId: DEMO_USER_ID },
    });

    const total = books.length;
    const avg =
      books.reduce((acc, b) => acc + (b.rating ?? 0), 0) /
      (books.filter((b) => b.rating).length || 1);

    return {
      totalBooks: total,
      avgRating: avg,
    };
  },
});

// =========================================================
// HANDLER PRINCIPAL
// =========================================================

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = BodySchema.parse(json);

    const safeMessages = parsed.messages.map((m) => ({
      role: m.role,
      content: sanitize(m.content) ?? "",
    }));

    const response = await streamText({
      model: openrouter(
        process.env.OPENROUTER_MODEL ?? "anthropic/claude-3-haiku"
      ),
      messages: safeMessages,
      tools: {
        searchBooks: searchBooksTool,
        getBookDetails: getBookDetailsTool,
        addToReadingList: addToReadingListTool,
        getReadingList: getReadingListTool,
        markAsRead: markAsReadTool,
        getReadingStats: getReadingStatsTool,
      },
      system: `
Eres AI Book Advisor. Hablas español.
Usa tools cuando corresponda. Sé claro y amable.
`,
    });

    return response.toTextStreamResponse();
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err?.message }), {
      status: 500,
    });
  }
}
