import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function DisplayPage() {
  const cookieStore = await cookies();
  const igrejaId = cookieStore.get('igrejaId')?.value;

  if (!igrejaId) {
    redirect('/login');
  }

  const igreja = await prisma.igreja.findUnique({
    where: { id: Number(igrejaId) },
    select: { slug: true, ativo: true },
  });

  if (!igreja || !igreja.ativo || !igreja.slug) {
    redirect('/login');
  }

  redirect(`/display/${igreja.slug}`);
}