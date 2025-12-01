import "./globals.css";
import { Web3Provider } from "@/providers/Web3Provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-100">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
