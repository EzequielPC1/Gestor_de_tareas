import Link from "next/link";

export default function HomePage() {
  return (
    <section
      className="
        flex flex-col items-center justify-center gap-8 py-20 text-center
        min-h-screen w-full
        bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100
        dark:from-purple-900 dark:via-pink-900 dark:to-indigo-900
      "
    >
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
         Chatbot EzePerCab
      </h1>

      <p className="text-neutral-700 dark:text-neutral-300 text-lg max-w-xl">
        Chatbot creado con Next.js 16, OpenRouter y AI SDK.  
        Elegí una opción del menú o empezá a chatear ahora:
      </p>

      <Link
        href="/chat"
        className="
          px-6 py-3 rounded-lg text-lg font-semibold shadow
          bg-pink-500 hover:bg-pink-600 text-white
          transition-all duration-200
        "
      >
        Ir al Chat 
      </Link>
    </section>
  );
}
