import type { Metadata } from 'next';
import { SeoPageLayout } from '@/components/shared/SeoPageLayout';

export const metadata: Metadata = {
  title: 'Contact Us | roz-kuch-naya',
  description:
    'Get in touch with roz-kuch-naya for editorial feedback, content corrections, partnerships, or general support inquiries.'
};

export default function ContactPage() {
  return (
    <SeoPageLayout
      title="Contact"
      description="Reach out for feedback, corrections, business inquiries, or general support."
    >
      <h2>General Inquiries</h2>
      <p>
        For general questions, editorial suggestions, or collaboration discussions, you can reach us
        at: <a href="mailto:hello@rozkuchnaya.com">hello@rozkuchnaya.com</a>
      </p>

      <h2>Corrections and Feedback</h2>
      <p>
        If you identify factual issues or clarity gaps in any article, please include the article URL
        and a brief description so our team can review quickly.
      </p>

      <h2>Partnerships</h2>
      <p>
        For strategic partnerships, content integrations, or media opportunities, contact:
        <a href="mailto:partnerships@rozkuchnaya.com"> partnerships@rozkuchnaya.com</a>
      </p>

      <h2>Response Time</h2>
      <p>
        We typically respond within 2-5 business days. For urgent correction requests, include
        “Urgent” in your email subject line.
      </p>
    </SeoPageLayout>
  );
}
