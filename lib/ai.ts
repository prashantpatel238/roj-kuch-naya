const DELHI_TOPICS = [
  'How Delhi Metro connectivity shapes daily commuting routines',
  'Seasonal weather patterns in Delhi and practical health preparedness',
  'Understanding Delhi\'s neighborhood markets for everyday household shopping',
  'Water conservation habits suitable for homes in Delhi',
  'How to plan a budget-friendly weekend itinerary across Delhi zones',
  'Public parks and open spaces in Delhi for community wellness',
  'Managing air quality exposure in Delhi through daily lifestyle choices',
  'A practical guide to government service access workflows in Delhi',
  'Education support ecosystems for students and families in Delhi',
  'Sustainable mobility options beyond private vehicles in Delhi'
] as const;

const ARTICLE_DISCLAIMER =
  'This article is AI-generated for informational purposes only.';

type HeadingSection = {
  h2: string;
  h3Blocks: Array<{
    h3: string;
    paragraphs: string[];
  }>;
};

export interface GeneratedArticle {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  wordCount: number;
  disclaimer: string;
}

export function generateDelhiTopics(): string[] {
  return [...DELHI_TOPICS];
}

export function generateSeoArticle(topic: string): GeneratedArticle {
  const normalizedTopic = topic.trim();

  if (!normalizedTopic) {
    throw new Error('Topic is required to generate an article.');
  }

  const title = `${normalizedTopic}: A Practical Delhi Guide`;
  const slug = toSlug(normalizedTopic);
  const metaTitle = `${normalizedTopic} | Delhi Informational Guide`;
  const metaDescription =
    'Read a neutral, structured Delhi-focused informational guide with practical insights, planning tips, and everyday best practices.';

  const sections = buildSections(normalizedTopic);
  const articleBody = buildMarkdownArticle(normalizedTopic, sections);
  const withDisclaimer = `${articleBody}\n\n${ARTICLE_DISCLAIMER}`;
  const safeContent = enforceSafetyConstraints(withDisclaimer);
  const wordCount = countWords(safeContent);

  if (wordCount < 800 || wordCount > 1200) {
    throw new Error(
      `Generated article length is out of bounds (${wordCount} words). Expected 800-1200 words.`
    );
  }

  return {
    title,
    slug,
    metaTitle,
    metaDescription,
    content: safeContent,
    wordCount,
    disclaimer: ARTICLE_DISCLAIMER
  };
}

function buildSections(topic: string): HeadingSection[] {
  const sections: HeadingSection[] = [
    {
      h2: `Why ${topic} matters in everyday Delhi life`,
      h3Blocks: [
        {
          h3: 'Urban context and local relevance',
          paragraphs: [
            `${topic} becomes practical when residents connect it to daily movement, housing realities, climate variation, and neighborhood-level services. Delhi has dense transit corridors, mixed land use patterns, and diverse social routines, so guidance works best when it is realistic, inclusive, and easy to apply in small steps.`,
            'A neutral approach focuses on options rather than judgments. Households, students, professionals, and senior citizens may all use different routines, yet they still benefit from the same principles: planning ahead, reducing avoidable friction, and making incremental improvements in time management and resource usage.',
            'In fast-moving urban settings, consistency often matters more than one-time effort. People who document what works for them over two to four weeks usually discover patterns that help them decide where to optimize budget, effort, travel, and day-to-day coordination.'
          ]
        },
        {
          h3: 'Common constraints and practical opportunities',
          paragraphs: [
            'Most residents manage multiple constraints at once, including commuting time, seasonal discomfort, and variable service response windows. A practical guide should therefore encourage adaptive routines that can flex between weekdays and weekends without requiring expensive changes.',
            'Simple operational habits can significantly improve outcomes: preparing a weekly checklist, maintaining backup timing options, and confirming key steps before peak hours. These habits reduce uncertainty and improve confidence when handling routine city tasks.',
            'When people choose accessible, low-complexity actions first, adoption rates improve. Over time, these actions create measurable benefits such as less time loss, better schedule reliability, and healthier personal bandwidth for work, family, and rest.'
          ]
        }
      ]
    },
    {
      h2: `How to build a reliable approach for ${topic}`,
      h3Blocks: [
        {
          h3: 'Planning framework for weekly execution',
          paragraphs: [
            'Begin with a lightweight planning framework that separates essential tasks, optional tasks, and delegated tasks. In Delhi, daily conditions can shift quickly, so a resilient plan keeps one primary route, one alternative route, and one fallback timing slot for critical activities.',
            'Use a simple matrix: urgency, effort, and dependency. Tasks with high urgency and high dependency should be placed early in the day. Tasks with moderate urgency can be grouped together in one block to reduce context switching and travel repetition.',
            'Documenting these choices in a notes app or notebook creates a reusable reference model. After two cycles, the model becomes easier to maintain and can be shared with family members or teammates for smoother coordination.'
          ]
        },
        {
          h3: 'Execution habits that remain realistic',
          paragraphs: [
            'Execution should prioritize sustainability over intensity. Instead of introducing many changes at once, introduce one change per week and measure whether it is easy to maintain. If a change creates stress or recurring delays, simplify it and retest.',
            'A practical rhythm includes preparation the night before, confirmation in the morning, and reflection in the evening. This small loop improves awareness and helps identify obstacles early, especially when managing public transport, local errands, and administrative work.',
            'If family members or collaborators are involved, define shared expectations clearly: timing windows, communication channels, and escalation triggers. Clear expectations reduce misunderstandings and prevent last-minute pressure.'
          ]
        }
      ]
    },
    {
      h2: `SEO and content structure best practices for ${topic}`,
      h3Blocks: [
        {
          h3: 'Organizing headings for clarity and search intent',
          paragraphs: [
            'A clear article structure helps both readers and search systems interpret information accurately. The opening section should summarize what the guide covers, while each H2 section addresses a distinct user intent such as planning, execution, or long-term improvement.',
            'Under each H2 heading, H3 subheadings can break content into manageable units. This approach reduces cognitive load and makes it easier for users to scan for the exact advice they need, especially on mobile devices where short attention windows are common.',
            'Keyword usage should remain natural and context-first. Repeating phrases mechanically can reduce readability. Instead, use semantic variation around Delhi-focused informational language, practical guidance terms, and user outcome vocabulary.'
          ]
        },
        {
          h3: 'Readability, neutrality, and responsible language',
          paragraphs: [
            'Neutral tone improves trust in informational writing. Use balanced phrasing, avoid sensational statements, and focus on actionable steps that readers can evaluate independently. Informational content should guide, not pressure.',
            'Responsible writing also avoids unsupported claims about organizations, individuals, or public events. The goal is to offer method-driven guidance that remains useful over time, rather than reacting to temporary narratives.',
            'Readability can be strengthened through concise paragraphs, explicit transitions, and direct summaries. At the end of each major section, include one short takeaway line to reinforce practical next steps for the reader.'
          ]
        }
      ]
    },
    {
      h2: `Long-term improvement model for ${topic}`,
      h3Blocks: [
        {
          h3: 'Monthly review and optimization loop',
          paragraphs: [
            'Long-term success comes from review, not perfection. A monthly review can capture what worked, what failed, and what changed in personal priorities. In city life, static plans are rarely sufficient, so adaptation should be treated as part of the process.',
            'Track a few stable metrics: time saved, cost predictability, completion rate, and perceived stress. These metrics provide enough signal to improve decisions without creating complex analytics overhead.',
            'Once trends become visible, revise only one or two variables at a time. Controlled adjustments make it easier to identify cause and effect, which is critical for maintaining progress without introducing confusion.'
          ]
        },
        {
          h3: 'Community-aware and inclusive decision making',
          paragraphs: [
            'Delhi includes diverse communities with varied constraints, so inclusive planning improves relevance. Consider accessibility, affordability, and language preference when drafting informational recommendations for broad audiences.',
            'When sharing guidance, frame it as adaptable options rather than universal rules. This respects individual contexts and reduces pressure on readers whose constraints differ from the majority pattern.',
            'A steady, informed, and neutral mindset helps readers make durable decisions. Over time, this approach builds confidence, supports better daily outcomes, and encourages responsible information use in urban environments.'
          ]
        }
      ]
    }
  ];

  return sections;
}

function buildMarkdownArticle(topic: string, sections: HeadingSection[]): string {
  const intro =
    `${topic} is best approached through a structured, practical, and neutral framework that supports everyday decision making in Delhi. This guide explains how to plan routines, improve execution, and maintain consistency over time while keeping recommendations realistic for diverse households and schedules.`;

  const sectionText = sections
    .map((section) => {
      const blocks = section.h3Blocks
        .map((block) => `### ${block.h3}\n\n${block.paragraphs.join('\n\n')}`)
        .join('\n\n');

      return `## ${section.h2}\n\n${blocks}`;
    })
    .join('\n\n');

  const conclusion =
    `In summary, ${topic.toLowerCase()} can be managed effectively through small, repeatable actions, clear structure, and periodic review. A neutral and method-based approach improves readability, supports better outcomes, and keeps informational content useful for a wide range of readers in Delhi.`;

  return `${intro}\n\n${sectionText}\n\n${conclusion}`;
}

function enforceSafetyConstraints(content: string): string {
  const bannedPatterns = [
    /according to\s+[A-Z]/gi,
    /reported by/gi,
    /breaking news/gi,
    /alleged crime/gi,
    /fraudulent brand/gi,
    /criminal organization/gi
  ];

  const hasBannedPattern = bannedPatterns.some((pattern) => pattern.test(content));

  if (hasBannedPattern) {
    throw new Error('Generated content violated safety constraints.');
  }

  return content;
}

function countWords(input: string): number {
  return input
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
