import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow p-8 flex flex-col gap-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-zinc-800 mb-2">Painel Igreja</h1>

        <Link
          href="/admin/avisos"
          className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Gerenciar Avisos
        </Link>
        <Link
          href="/admin/membros"
          className="block text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Gerenciar Membros
        </Link>

        {/* Serviços */}
        <Link
          href="/admin/tipos"
          className="block text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Tipos de Serviço
        </Link>
        <Link
          href="/admin/servicos"
          className="block text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Serviços dos Irmãos
        </Link>

        {/* Voluntariado */}
        <Link
          href="/admin/voluntario-areas"
          className="block text-center bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Áreas de Voluntariado
        </Link>
        <Link
          href="/admin/voluntarios"
          className="block text-center bg-cyan-800 hover:bg-cyan-900 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Voluntários
        </Link>

        <Link
          href="/display"
          className="block text-center bg-zinc-800 hover:bg-zinc-900 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Tela de Display (TV)
        </Link>
      </div>
    </div>
  );
}