import { redirect } from 'next/navigation';

interface LegacyPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return [];
}

export default function LegacyPostPage({ params }: LegacyPostPageProps) {
  redirect(`/en/post/${params.slug}`);
}
