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
  validator.ts
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
- `GET /api/posts?category=<daily|trending|rochak>&page=<n>&limit=<n>`: returns published posts sorted by newest `createdAt` first.
- `GET /api/posts/<slug>?language=<hi|en>`: returns a published post by slug for full article rendering.

## AI Content Service

`lib/ai.ts` provides:

- `generateDelhiTopics()`: returns 10 unique Delhi-focused informational topics.
- `generateSeoArticle(topic, options)`: returns a full SEO-oriented article payload with:
  - regeneration on validation failure
  - validator-enforced minimum 600 words
  - structured `##` (H2) and `###` (H3) sections
  - automatic disclaimer append:
    `This article is AI-generated for informational purposes only.`
  - neutral informative language safeguards (no real news-source references, no brand defamation wording, no crime accusations)

## Validation Service

`lib/validator.ts` validates generated article payloads for:

- minimum 600 words
- unique title (against provided existing titles)
- no banned phrases:
  - `according to Times of India`
  - `reported by NDTV`
- valid post category assignment (`daily | trending | rochak`)
- unique slug (against provided existing slugs)

If validation fails during article generation, `generateSeoArticle` retries and regenerates content up to a capped number of attempts.

## Auto Generation Script

Generate and publish content automatically with:

```bash
node scripts/autoGenerate.ts
```

What it does:

- generates 2 posts per category (`daily`, `trending`, `rochak`)
- validates each post (word count, category, title/slug uniqueness, banned phrases)
- saves valid posts into MongoDB `posts` collection
- writes posts with `status: "published"`
- logs per-item failures and continues safely without crashing the full run

## Homepage Experience

The homepage now includes a responsive content layout with three sections:

- Daily News
- Trending
- Rochak Jaankari

Each section:

- fetches and shows 6 latest published posts
- supports pagination via **Load More**
- responds to Hindi/English language toggle in the navbar
- uses a clean modern card-based UI

## Legal & Company Pages (SEO Optimized)

The following SEO-optimized pages are available:

- `/privacy-policy`
- `/disclaimer` (includes AI-generated content notice)
- `/about`
- `/contact`

Each page includes:

- dedicated metadata title and description
- clear heading structure
- readable long-form content suitable for search indexing


## Post Detail Page

- Routes: `/en/post/[slug]` and `/hi/post/[slug]`
- Fetches full post content from API by slug
- Language toggle preserves the same slug while switching locale path
- Includes SEO metadata via Next.js `generateMetadata`


## Sitemap

- Dynamic sitemap is generated at `/sitemap.xml` via `app/sitemap.ts`.
- Includes static site pages and all published posts.
- Each post entry includes `hreflang` alternates for English (`/en/post/[slug]`) and Hindi (`/hi/post/[slug]`).
