import { isPostCategory, type PostCategory } from '@/lib/models/post';

export const BANNED_PHRASES = [
  'according to Times of India',
  'reported by NDTV'
] as const;

export interface ArticleValidationInput {
  title: string;
  slug: string;
  content: string;
  category: string;
  existingTitles?: Iterable<string>;
  existingSlugs?: Iterable<string>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateArticle(input: ArticleValidationInput): ValidationResult {
  const errors: string[] = [];

  if (countWords(input.content) < 600) {
    errors.push('Article content must be at least 600 words.');
  }

  if (containsBannedPhrase(input.content)) {
    errors.push('Article content contains banned phrases.');
  }

  if (!isUniqueTitle(input.title, input.existingTitles)) {
    errors.push('Article title must be unique.');
  }

  if (!isUniqueSlug(input.slug, input.existingSlugs)) {
    errors.push('Article slug must be unique.');
  }

  if (!isPostCategory(input.category)) {
    errors.push('Article category is invalid.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function assertValidCategory(category: string): asserts category is PostCategory {
  if (!isPostCategory(category)) {
    throw new Error(`Invalid category: ${category}`);
  }
}

function isUniqueTitle(title: string, existingTitles?: Iterable<string>): boolean {
  if (!existingTitles) {
    return true;
  }

  const normalizedTitle = normalizeText(title);

  for (const existingTitle of existingTitles) {
    if (normalizeText(existingTitle) === normalizedTitle) {
      return false;
    }
  }

  return true;
}

function isUniqueSlug(slug: string, existingSlugs?: Iterable<string>): boolean {
  if (!existingSlugs) {
    return true;
  }

  const normalizedSlug = slug.trim().toLowerCase();

  for (const existingSlug of existingSlugs) {
    if (existingSlug.trim().toLowerCase() === normalizedSlug) {
      return false;
    }
  }

  return true;
}

function containsBannedPhrase(content: string): boolean {
  const normalizedContent = normalizeText(content);

  return BANNED_PHRASES.some((phrase) => normalizedContent.includes(normalizeText(phrase)));
}

function countWords(input: string): number {
  return input
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}
