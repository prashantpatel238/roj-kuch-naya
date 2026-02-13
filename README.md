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
- provides a full-width mobile-friendly **Load More** button per section

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
- Includes SEO metadata via Next.js `generateMetadata` (OpenGraph + Twitter)
- Emits JSON-LD `Article` structured data on the detail page
- Uses reusable SEO utilities from `lib/seo.ts` for canonical, hreflang, Twitter, and structured data generation
- Shows estimated reading time based on post word count


## Sitemap

- Dynamic sitemap is generated at `/sitemap.xml` via `app/sitemap.ts`.
- Includes static site pages and all published posts.
- Each post entry includes `hreflang` alternates for English (`/en/post/[slug]`) and Hindi (`/hi/post/[slug]`).


## Robots

- Dynamic robots file is generated at `/robots.txt` via `app/robots.ts`.
- It allows crawling and points search engines to `/sitemap.xml`.


## Crawl Control

- `/robots.txt` allows public pages and disallows `/admin` and `/internal`.
- `app/admin/layout.tsx` and `app/internal/layout.tsx` include noindex/nofollow metadata for search engines.

## Testing `GET /api/currentAffairs`

Use these steps to test the current affairs API route locally and after deployment.

### 1) Local testing (development)

1. Start the app:

   ```bash
   npm run dev
   ```

2. Open this URL in your browser or API client:

   ```text
   http://localhost:3000/api/currentAffairs
   ```

3. Or test via curl:

   ```bash
   curl -s http://localhost:3000/api/currentAffairs
   ```

### 2) After deployment (production)

Replace `<your-domain>` with your live domain:

```bash
curl -s https://<your-domain>/api/currentAffairs
```

You can also test from a browser:

```text
https://<your-domain>/api/currentAffairs
```

### 3) Verify JSON structure

Expected top-level response:

```json
{
  "items": [
    {
      "_id": "...",
      "title": "...",
      "summary": "...",
      "date": "...",
      "slug": "..."
    }
  ]
}
```

Validation checklist:

- Response is valid JSON.
- Top-level key `items` exists and is an array.
- Array contains up to 3 most recent documents (sorted by `date` descending).
- Each item includes safe display fields such as `title`, `summary`, and `date`.

Optional quick checks with `jq`:

```bash
curl -s http://localhost:3000/api/currentAffairs | jq '.items | length'
curl -s http://localhost:3000/api/currentAffairs | jq '.items[0] | {title, summary, date, slug}'
```


## One-Time Posts Cleanup

Use this only when you intentionally want to permanently delete **all** documents from `posts`.

### Run locally (manual)

```bash
MONGODB_URI="<your-mongodb-uri>" MONGODB_DB="roj-kuch-naya" npm run clean:db
```

The script will:
- connect using the shared MongoDB utility (`lib/db/mongodb.ts`)
- delete all documents from `roj-kuch-naya.posts`
- print how many documents were deleted

### Run from GitHub Actions (manual)

A manual workflow is available at:
- **Actions → One-Time Clean Posts Collection → Run workflow**

Inputs:
- `confirm`: must be exactly `DELETE_POSTS`
- `mongodb_db`: defaults to `roj-kuch-naya`

Required repository secret:
- `MONGODB_URI`

The workflow is **not scheduled** and only runs when manually triggered.
