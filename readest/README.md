# App de Reseñas de Libros 📚

Plataforma de descubrimiento y reseñas de libros construida con **Next.js**, **TypeScript**, **Prisma** y **SQLite**.

## 🚀 Deploy

- URL en producción: **https://TU-APP.vercel.app**

(Actualiza este valor cuando hagas el deploy en Vercel.)

---

## 🧩 Tecnologías

- Next.js (App Router)
- React
- TypeScript
- Prisma ORM
- SQLite
- GitHub Actions (CI/CD)
- Docker

---

## 🔎 Funcionalidades

- Búsqueda de libros usando **Google Books API**
- Ver detalles del libro: título, autor, portada, descripción, etc.
- Crear reseñas para un libro:
  - Calificación de 0 a 5
  - Texto de reseña
  - Nombre del revisor
- Listar reseñas de cada libro
- (Opcional) Votación positiva/negativa de reseñas

---

## 🌐 Google Books API

- Endpoint base: `https://www.googleapis.com/books/v1/volumes`
- Ejemplos:
  - Por título: `?q=harry+potter`
  - Por autor: `?q=inauthor:rowling`
  - Por ISBN: `?q=isbn:9780439708180`
- No requiere API key para uso básico.

---

## 🗄️ Modelo de datos (Prisma)

```prisma
model Book {
  id        Int       @id @default(autoincrement())
  title     String
  author    String
  reviews   Review[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Review {
  id        Int      @id @default(autoincrement())
  content   String   @db.Text
  reviewer  String
  rating    Int      @default(0)
  createdAt DateTime @default(now())
  bookId    Int
  book      Book     @relation(fields: [bookId], references: [id])

  @@check(rating >= 0 && rating <= 5)
}
