// app/chat/page.tsx
"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";

export default function ChatPage() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useChat({
    api: "/api/chat",
  });

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">AI Book Advisor 📚</h1>

      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-4 flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`my-2 flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[80%] text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {isLoading && (
          <p className="text-xs text-gray-500 mt-2">
            Pensando / ejecutando herramientas…
          </p>
        )}

        {error && (
          <p className="text-xs text-red-600 mt-2">
            Error: {String(error)}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2 text-sm"
            placeholder="Pedí recomendaciones: 'Recomendame ciencia ficción'..."
            value={input}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
