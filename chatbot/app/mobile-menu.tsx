"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden relative">
      
      {/* Botón animado */}
      <button
        onClick={() => setOpen(!open)}
        className="
          p-2 rounded-md 
          hover:bg-neutral-200/60 dark:hover:bg-neutral-700/50
          transition
        "
      >
        {open ? "✕" : "☰"}
      </button>

      {/* Dropdown elegante */}
      {open && (
        <div
          className="
            absolute right-0 mt-3 w-44 
            bg-white dark:bg-neutral-900
            border border-neutral-200 dark:border-neutral-800
            rounded-xl shadow-xl 
            py-2
            flex flex-col gap-1
            animate-fade-in
          "
        >
          <MobileItem href="/" label="Inicio" close={() => setOpen(false)} />
          <MobileItem href="/chat" label="Chat" close={() => setOpen(false)} />
          <MobileItem href="/sobre" label="Sobre" close={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

/* Item del menú mobile */
function MobileItem({ href, label, close }: any) {
  return (
    <Link
      href={href}
      onClick={close}
      className="
        px-4 py-2 text-sm 
        hover:bg-neutral-100 dark:hover:bg-neutral-800
        transition rounded-md
      "
    >
      {label}
    </Link>
  );
}
