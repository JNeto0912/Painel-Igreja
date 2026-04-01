'use client';

import { useRouter } from 'next/navigation';

export default function BotaoLogout() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-zinc-500 hover:text-red-600 transition"
    >
      Sair
    </button>
  );
}