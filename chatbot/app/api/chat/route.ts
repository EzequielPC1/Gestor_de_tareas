import { NextRequest } from "next/server";
import { z } from "zod";
import OpenAI from "openai";

export const runtime = "edge";

// Validación Zod
const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(2000),
});

const ChatBodySchema = z.object({
  messages: z.array(MessageSchema).min(1),
});

// Cliente OpenRouter usando el SDK oficial OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: process.env.OPENROUTER_BASE_URL!,
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = ChatBodySchema.safeParse(json);

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
      });
    }


    const response = await client.responses.create({
      model: process.env.OPENROUTER_MODEL ?? "anthropic/claude-3-haiku",
      input: parsed.data.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const event of response) {
          if (event.type === "response.output_text.delta") {
            controller.enqueue(new TextEncoder().encode(event.delta));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (err: any) {
  console.error("Chat API error:", err);

  return new Response(
    JSON.stringify({
      error: "Internal error",
      details: String(err?.message || err),
    }),
    { status: 500 }
  );
}

}
