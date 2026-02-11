import type { Metadata } from 'next';
import { SeoPageLayout } from '@/components/shared/SeoPageLayout';

export const metadata: Metadata = {
  title: 'About Us | roz-kuch-naya',
  description:
    'Learn about roz-kuch-naya, a Delhi-focused informational platform delivering daily updates, trending insights, and rochak knowledge in Hindi and English.'
};

export default function AboutPage() {
  return (
    <SeoPageLayout
      title="About"
      description="roz-kuch-naya is a Delhi-focused informational platform built to make useful everyday knowledge easy to discover in Hindi and English."
    >
      <h2>Who We Are</h2>
      <p>
        roz-kuch-naya is a modern content platform focused on practical, city-relevant information
        for readers who want concise, neutral, and accessible guidance.
      </p>

      <h2>What We Publish</h2>
      <ul>
        <li>
          <strong>Daily News:</strong> frequently updated informational summaries.
        </li>
        <li>
          <strong>Trending:</strong> high-interest topics explained in a reader-friendly format.
        </li>
        <li>
          <strong>Rochak Jaankari:</strong> engaging knowledge-based content designed for curious
          readers.
        </li>
      </ul>

      <h2>Our Editorial Approach</h2>
      <p>
        We prioritize clarity, neutrality, and usefulness. Content is structured for readability and
        optimized for both mobile and desktop readers.
      </p>

      <h2>Language Accessibility</h2>
      <p>
        The platform supports Hindi and English so readers can access key information in their
        preferred language.
      </p>

      <h2>Our Mission</h2>
      <p>
        Our mission is to provide meaningful, easy-to-understand information that helps users stay
        informed without information overload.
      </p>
    </SeoPageLayout>
  );
}
