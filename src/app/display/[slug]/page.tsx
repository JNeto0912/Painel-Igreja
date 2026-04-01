import DisplayClient from './DisplayClient';

export const dynamic = 'force-dynamic';

type Props = {
  params: { slug: string };
};

export default function DisplaySlugPage({ params }: Props) {
  return <DisplayClient slug={params.slug} />;
}