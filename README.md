# roz-kuch-naya

Production-ready **Next.js 14** starter project with:

- TypeScript + App Router
- Tailwind CSS
- MongoDB integration
- API routes (App Router handlers)
- ESLint + Prettier
- Environment variable validation

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Fill in your MongoDB connection details.

3. Run in development:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   npm run start
   ```

## Folder Structure

```text
app/
  api/
    health/route.ts
    status/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  ui/
    StatusCard.tsx
lib/
  ai.ts
  config/
    env.ts
  db/
    mongodb.ts
  models/
    post.ts
```

## MongoDB Post Model

The `Post` model is defined in `lib/models/post.ts` with fields:

- `title: string`
- `slug: string` (unique)
- `category: 'daily' | 'trending' | 'rochak'`
- `language: 'hi' | 'en'`
- `content: string`
- `metaTitle: string`
- `metaDescription: string`
- `imageUrl: string`
- `status: 'draft' | 'published'`
- `createdAt: Date`

Indexes ensured via `ensurePostIndexes`:

- Unique index on `slug`
- Non-unique index on `category`

## API Endpoints

- `GET /api/health`: Static health response.
- `GET /api/status`: MongoDB connectivity status (`ping`) and index initialization status.

## AI Content Service

`lib/ai.ts` provides:

- `generateDelhiTopics()`: returns 10 unique Delhi-focused informational topics.
- `generateSeoArticle(topic)`: returns a full SEO-oriented article payload with:
  - 800-1200 word validation
  - structured `##` (H2) and `###` (H3) sections
  - automatic disclaimer append:
    `This article is AI-generated for informational purposes only.`
  - neutral informative language safeguards (no real news-source references, no brand defamation wording, no crime accusations)
