import Link from 'next/link';


export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-zinc-800 mb-6">Painel Igreja</h1>

        <div className="grid gap-8 md:grid-cols-[2fr,1.2fr]">

          {/* COLUNA ESQUERDA - MENU PRINCIPAL */}
          <div>
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
              Conteúdo e Ministérios
            </h2>

            <div className="flex flex-col gap-3">
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

               <Link
                href="/admin/servicos"
                className="block text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Serviços dos Irmãos
              </Link>

              <Link
                href="/voluntarios/inscricao"
                className="block text-center bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Quero ser voluntário
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

          {/* COLUNA DIREITA - ADMINISTRAÇÃO DO SISTEMA */}
          <div>
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
              Administração do Sistema
            </h2>

            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col gap-3">
              <p className="text-xs text-zinc-400">
                Configurações e controle de acesso ao painel.
              </p>

              <Link
                href="/admin/usuarios"
                className="block text-left bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
              >
                Gerenciar Usuários
                <span className="block text-[11px] font-normal text-amber-100 mt-0.5">
                  Aprovar acessos e definir administradores
                </span>
              </Link>

              <Link
                href="/admin/voluntario-areas"
                className="block text-center bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Áreas de Voluntariado
              </Link>

             <Link
                href="/admin/tipos"
                className="block text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Tipos de Serviço
              </Link>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}