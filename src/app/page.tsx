import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function HomePage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('auth')?.value;

  // Se já está logado, vai direto pro admin
  if (auth) {
    redirect('/admin');
  }

  // Se não está logado, vai para o login
  redirect('/login');
}