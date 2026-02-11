import type { Metadata } from 'next';
import { SeoPageLayout } from '@/components/shared/SeoPageLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | roz-kuch-naya',
  description:
    'Read the privacy policy for roz-kuch-naya to understand how user data, cookies, and analytics information are handled securely and transparently.'
};

export default function PrivacyPolicyPage() {
  return (
    <SeoPageLayout
      title="Privacy Policy"
      description="This policy explains what data we collect, why we collect it, and how we protect your information."
    >
      <h2>Information We Collect</h2>
      <p>
        We may collect basic usage information such as browser type, device information, pages
        visited, and session timestamps to improve the performance and reliability of
        roz-kuch-naya.
      </p>

      <h2>How We Use Information</h2>
      <p>
        Collected information is used to optimize user experience, maintain platform security,
        improve editorial quality, and understand high-level content performance trends.
      </p>

      <h2>Cookies and Analytics</h2>
      <p>
        Cookies or similar technologies may be used for session continuity, language preferences,
        and anonymous analytics. You can manage cookie preferences through your browser settings.
      </p>

      <h2>Data Security</h2>
      <p>
        We apply reasonable technical and organizational safeguards to reduce unauthorized access,
        data misuse, or accidental data loss. No transmission method is entirely risk-free, but we
        continuously improve our controls.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        Some infrastructure components such as hosting, databases, and analytics providers may
        process limited technical data as part of service delivery. These providers are selected
        based on reliability and security standards.
      </p>

      <h2>Updates to This Policy</h2>
      <p>
        This Privacy Policy may be updated periodically. Material updates will be reflected on this
        page with revised language.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy-related questions, please visit the <a href="/contact">Contact page</a>.
      </p>
    </SeoPageLayout>
  );
}
