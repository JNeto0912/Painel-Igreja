'use client';

import { useState } from 'react';

export default function BotaoCopiarLink({ url }: { url: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <button
      onClick={copiar}
      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold px-3 py-2 transition-colors"
    >
      {copiado ? (
        <>
          <span>✅</span>
          Copiado!
        </>
      ) : (
        <>
          <span>📋</span>
          Copiar
        </>
      )}
    </button>
  );
}