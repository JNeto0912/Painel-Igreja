import DisplayClient from './DisplayClient';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function DisplaySlugPage({ params }: Props) {
  const { slug } = await params;
  return <DisplayClient slug={slug} />;
}