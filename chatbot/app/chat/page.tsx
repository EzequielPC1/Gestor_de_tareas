"use client";

import React, { useState, useRef, useEffect } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: userMessage.content },
          ],
        }),
      });

      if (!res.ok || !res.body) throw new Error("Error en API");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      let done = false;
      while (!done) {
        const { value, done: dr } = await reader.read();
        done = dr;
        if (value) {
          const chunk = decoder.decode(value);

          assistantMessage = {
            ...assistantMessage,
            content: assistantMessage.content + chunk,
          };

          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMessage.id ? assistantMessage : m))
          );
        }
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al enviar el mensaje.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Chatbot AI</h1>

      <div className="bg-white w-full max-w-xl rounded-lg shadow p-4 flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className={`my-2 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`p-2 rounded-lg max-w-[75%] ${
                m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {loading && <p className="text-sm text-gray-500">Escribiendo...</p>}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <form onSubmit={sendMessage} className="flex gap-2 mt-4">
          <input
            className="flex-1 border rounded p-2"
            placeholder="Tu mensaje…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
