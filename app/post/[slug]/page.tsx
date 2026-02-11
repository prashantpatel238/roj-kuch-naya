import { redirect } from 'next/navigation';

interface LegacyPostPageProps {
  params: {
    slug: string;
  };
}

export default function LegacyPostPage({ params }: LegacyPostPageProps) {
  redirect(`/en/post/${params.slug}`);
}
