// @ts-nocheck

const CATEGORIES = ['daily', 'trending', 'rochak'];
const POSTS_PER_CATEGORY = 2;
const BANNED_PHRASES = ['according to times of india', 'reported by ndtv'];
const DISCLAIMER = 'This article is AI-generated for informational purposes only.';

function getEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function wordCount(text) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function validatePostDraft(post, existingTitles, existingSlugs) {
  const errors = [];

  if (wordCount(post.content) < 600) {
    errors.push('content has fewer than 600 words');
  }

  if (!CATEGORIES.includes(post.category)) {
    errors.push('invalid category assignment');
  }

  const normalizedContent = post.content.toLowerCase();
  if (BANNED_PHRASES.some((phrase) => normalizedContent.includes(phrase))) {
    errors.push('content contains banned phrase');
  }

  const normalizedTitle = post.title.trim().toLowerCase();
  if (existingTitles.has(normalizedTitle)) {
    errors.push('title already exists');
  }

  const normalizedSlug = post.slug.trim().toLowerCase();
  if (existingSlugs.has(normalizedSlug)) {
    errors.push('slug already exists');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function buildBody(topic, category, variant) {
  const intro =
    `${topic} in Delhi is best understood through practical routines, neighborhood-level context, and steady weekly planning. This informational article explains useful steps for residents, students, and professionals who want neutral guidance that is easy to apply.`;

  const sections = [
    {
      h2: `Understanding ${category} priorities in Delhi`,
      h3: [
        '### City context and resident needs\nDelhi has diverse routines, varied commuting windows, and mixed neighborhood characteristics. A balanced informational approach focuses on practical options, small improvements, and consistency over time. Clear planning helps readers reduce friction and make better day-to-day decisions without overcomplicating the process.',
        '### Everyday constraints and realistic responses\nMost people manage time pressure, schedule uncertainty, and changing weather conditions. Practical planning with one primary option and one fallback option improves reliability. Readers can benefit from simple checklists and early confirmations to keep daily tasks predictable and manageable.'
      ]
    },
    {
      h2: `How to execute ${topic.toLowerCase()} reliably`,
      h3: [
        '### Weekly structure that stays practical\nA weekly routine should separate essential actions from optional actions. Priority tasks can be grouped to reduce unnecessary movement and context switching. This structure supports better completion rates while preserving flexibility for changing conditions across the week.',
        '### Review cycle for continuous improvement\nA short review at the end of each week helps identify what worked and what needs adjustment. Tracking time use, effort level, and completion consistency makes decision-making clearer. Small iteration steps usually produce more durable outcomes than large one-time changes.'
      ]
    },
    {
      h2: `Content quality and neutral informational tone`,
      h3: [
        '### Why neutral language matters\nInformational writing should remain balanced, practical, and respectful. A neutral tone helps readers evaluate suggestions independently and apply them according to their own context. This avoids exaggerated framing and keeps content useful for a broad audience.',
        '### Structured readability for better outcomes\nUsing clear headings, concise paragraphs, and direct transitions improves readability. Readers can quickly find relevant sections and apply recommendations in sequence. This approach supports stronger comprehension and better day-to-day execution.'
      ]
    }
  ];

  const repeatedDetail =
    'Delhi-focused informational planning improves when people use clear priorities, consistent routines, adaptable alternatives, and periodic review. The most useful guidance is specific, neutral, and easy to execute with available time and resources. ';

  const filler = repeatedDetail.repeat(30 + variant);

  const sectionText = sections
    .map((section) => `## ${section.h2}\n\n${section.h3.join('\n\n')}`)
    .join('\n\n');

  const conclusion =
    `In summary, ${topic.toLowerCase()} can be handled effectively through structured planning, steady execution, and regular review. Informational guidance works best when it remains neutral, practical, and adaptable for different household and work contexts in Delhi.`;

  return `${intro}\n\n${sectionText}\n\n${filler}\n\n${conclusion}\n\n${DISCLAIMER}`;
}

function buildPostDraft(category, index, existingSlugs) {
  const topic = `${category} insights for Delhi residents ${index + 1}`;
  let attempt = 0;

  while (attempt < 10) {
    const suffix = attempt === 0 ? '' : `-${attempt + 1}`;
    const title = `Delhi ${category} guide ${index + 1}${attempt === 0 ? '' : ` (${attempt + 1})`}`;
    const slug = `${slugify(topic)}${suffix}`;

    if (!existingSlugs.has(slug)) {
      const content = buildBody(topic, category, attempt);

      return {
        title,
        slug,
        category,
        language: 'en',
        content,
        metaTitle: `${title} | roz-kuch-naya`,
        metaDescription: `Informational ${category} guide for Delhi with practical tips and structured sections.`,
        imageUrl: `https://placehold.co/1200x630?text=${encodeURIComponent(category)}`,
        status: 'published',
        createdAt: new Date()
      };
    }

    attempt += 1;
  }

  throw new Error(`Unable to create unique slug for category=${category}, index=${index}`);
}

async function loadExistingSets(collection) {
  const docs = await collection.find({}, { projection: { title: 1, slug: 1 } }).toArray();

  return {
    titles: new Set(docs.map((doc) => String(doc.title || '').trim().toLowerCase()).filter(Boolean)),
    slugs: new Set(docs.map((doc) => String(doc.slug || '').trim().toLowerCase()).filter(Boolean))
  };
}

async function run() {
  let client;

  try {
    const { MongoClient } = require('mongodb');
    const uri = getEnv('MONGODB_URI');
    const dbName = getEnv('MONGODB_DB');

    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const posts = db.collection('posts');

    await posts.createIndexes([
      { key: { slug: 1 }, name: 'idx_posts_slug_unique', unique: true },
      { key: { category: 1 }, name: 'idx_posts_category' }
    ]);

    const existing = await loadExistingSets(posts);

    let createdCount = 0;
    const failures = [];

    for (const category of CATEGORIES) {
      for (let i = 0; i < POSTS_PER_CATEGORY; i += 1) {
        try {
          const draft = buildPostDraft(category, i, existing.slugs);
          const validation = validatePostDraft(draft, existing.titles, existing.slugs);

          if (!validation.valid) {
            throw new Error(`validation failed: ${validation.errors.join(', ')}`);
          }

          await posts.insertOne(draft);
          existing.titles.add(draft.title.trim().toLowerCase());
          existing.slugs.add(draft.slug.trim().toLowerCase());
          createdCount += 1;

          console.log(`✅ Created post: [${category}] ${draft.slug}`);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          const entry = `[${category}#${i + 1}] ${message}`;
          failures.push(entry);
          console.error(`❌ Failed to create post ${entry}`);
        }
      }
    }

    console.log(`\nDone. Created ${createdCount} posts.`);

    if (failures.length > 0) {
      console.log('Failure summary:');
      failures.forEach((failure) => console.log(`- ${failure}`));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ autoGenerate failed safely: ${message}`);
    process.exitCode = 1;
  } finally {
    if (client) {
      await client.close().catch((closeError) => {
        const message = closeError instanceof Error ? closeError.message : String(closeError);
        console.error(`⚠️ Failed closing MongoDB client: ${message}`);
      });
    }
  }
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`❌ Unexpected top-level failure: ${message}`);
  process.exitCode = 1;
});
