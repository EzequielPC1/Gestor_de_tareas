import "./globals.css";
import Link from "next/link";
import MobileMenu from "./mobile-menu";

export const metadata = {
  title: "Chatbot AI",
  description: "Chatbot avanzado con Next.js + OpenRouter + AI SDK",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark:bg-neutral-950 dark:text-white">
      <body className="min-h-screen bg-neutral-100 dark:bg-neutral-950">

        {/* NAVBAR PROFESIONAL */}
        <nav className="
          sticky top-0 z-50 
          backdrop-blur-xl 
          bg-white/50 dark:bg-neutral-900/40 
          border-b border-neutral-200/50 dark:border-neutral-800/50
          shadow-[0_2px_10px_rgba(0,0,0,0.04)]
        ">
          <div className="
            max-w-6xl mx-auto 
            px-6 py-4 
            flex items-center justify-between
          ">

            {/* LOGO */}
            <Link 
              href="/" 
              className="
                text-[22px] font-semibold tracking-tight 
                hover:text-blue-600 dark:hover:text-blue-400
                transition-colors
              "
            >
              Chatbot<span className="text-blue-600 dark:text-blue-400">AI</span>
            </Link>

            {/* LINKS DESKTOP */}
            <div className="hidden md:flex items-center gap-8">
              <NavItem href="/">Inicio</NavItem>
              <NavItem href="/chat">Chat</NavItem>
              <NavItem href="/sobre">Sobre</NavItem>
            </div>

            {/* MENU MOBILE */}
            <MobileMenu />
          </div>
        </nav>

        {/* CONTENIDO */}
        <main className="max-w-5xl mx-auto px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}

/* COMPONENTE DE LINK PROFESIONAL */
function NavItem({ href, children }: any) {
  return (
    <Link
      href={href}
      className="
        text-[15px] font-medium text-neutral-700 dark:text-neutral-300
        hover:text-blue-600 dark:hover:text-blue-400
        transition-colors
      "
    >
      {children}
    </Link>
  );
}
