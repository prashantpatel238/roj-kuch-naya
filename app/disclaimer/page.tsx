import type { Metadata } from 'next';
import { SeoPageLayout } from '@/components/shared/SeoPageLayout';

export const metadata: Metadata = {
  title: 'Disclaimer | roz-kuch-naya',
  description:
    'Important disclaimer for roz-kuch-naya content, including editorial limitations and AI-generated informational content notice.'
};

export default function DisclaimerPage() {
  return (
    <SeoPageLayout
      title="Disclaimer"
      description="Please read this disclaimer to understand the informational nature and limitations of content published on this platform."
    >
      <h2>Informational Purpose</h2>
      <p>
        Content on roz-kuch-naya is intended for general informational and educational purposes.
        It should not be interpreted as legal, financial, medical, or professional advice.
      </p>

      <h2>AI-Generated Content Notice</h2>
      <p>
        Some articles and summaries on this website are generated with AI assistance.
        <strong> This article is AI-generated for informational purposes only.</strong> Readers
        should independently verify important details before making decisions.
      </p>

      <h2>No Warranty</h2>
      <p>
        While we aim for clarity and accuracy, we do not guarantee completeness, timeliness, or
        suitability of any content for specific use cases.
      </p>

      <h2>External Links</h2>
      <p>
        References to external websites are provided for convenience only. We do not control or
        endorse third-party content, policies, or practices.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        roz-kuch-naya and its contributors are not liable for losses or damages resulting from the
        use of published information.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions regarding this disclaimer, please reach out via the{' '}
        <a href="/contact">Contact page</a>.
      </p>
    </SeoPageLayout>
  );
}
