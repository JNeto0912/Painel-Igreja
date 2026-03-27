'use server';

import { signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  try {
    await signIn('credentials', {
      username,
      password,
      redirectTo: '/admin/avisos',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);

    if (msg.includes('CredentialsSignin') || msg.includes('credentials')) {
      redirect('/login?erro=1');
    }

    throw error;
  }
}