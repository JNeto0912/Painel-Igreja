import Link from 'next/link';
import { cookies } from 'next/headers';
import BotaoLogout from '@/components/BotaoLogout';
import BotaoCopiarLink from '@/components/BotaoCopiarLink';

export default async function Home() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('isAdmin')?.value === 'true';
  const slug = cookieStore.get('slug')?.value ?? null;

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000';

  // Display já funciona direto, sem slug
  const urlDisplay = slug ? `${baseUrl}/display/${slug}` : null;

  // Apenas serviços, voluntários e inscrição usam slug
 // const urlServicosPublico    = slug ? `/servicos/${slug}/publico` : null;
 const urlServicosPublico    = slug ? `/servicos/${slug}/publico/servicos/` : null;
  const urlVoluntariosPublico = slug ? `/voluntarios/${slug}/publico` : null;
  const urlInscricao          = slug ? `/voluntarios/${slug}/inscricao` : null;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl">

        {/* HEADER */}
        <header className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <img
              src="/uploads/resolult.png"
              alt="Logo"
              className="h-10 w-auto object-contain drop-shadow"
            />
            <div>
              <h1 className="text-xl font-semibold text-white leading-tight">
                Painel da Igreja
              </h1>
              <p className="text-xs text-slate-400">
                Gerencie avisos, membros e ministérios v.2
              </p>
            </div>
          </div>
          <BotaoLogout />
        </header>

        {/* CARD LINK DO DISPLAY */}
        {urlDisplay && (
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-sky-950/60 border border-sky-700/50 rounded-2xl px-5 py-4 shadow-lg shadow-black/20">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📺</span>
              <div>
                <p className="text-sm font-semibold text-sky-200">
                  Link do Display (TV)
                </p>
                <p className="text-xs text-sky-400 mt-0.5 break-all">
                  {urlDisplay}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <BotaoCopiarLink url={urlDisplay} />
              <a
                href={urlDisplay}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-3 py-2 transition-colors"
              >
                <span>🔗</span>
                Abrir
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Acesse o display da nossa igreja: ${urlDisplay}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 transition-colors"
              >
                <span>📱</span>
                Zap
              </a>
            </div>
          </div>
        )}

        {/* GRID PRINCIPAL */}
        <div className={`grid gap-6 ${isAdmin ? 'md:grid-cols-[2fr,1.3fr]' : 'md:grid-cols-1'}`}>

          {/* COLUNA ESQUERDA */}
          <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/30">
            <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.18em] mb-5">
              Conteúdo e Ministérios
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">

              {/* Avisos */}
              <Link
                href="/admin/avisos"
                className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 px-4 py-3.5 text-white shadow-md hover:brightness-110 transition-all"
              >
                <span className="text-xl mt-0.5">📢</span>
                <div>
                  <p className="font-semibold text-sm">Gerenciar Avisos</p>
                  <p className="text-[11px] text-blue-100 mt-0.5">
                    Exibir comunicados no display e TV
                  </p>
                </div>
              </Link>

              {/* Membros */}
              <Link
                href="/admin/membros"
                className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-emerald-600 to-green-500 px-4 py-3.5 text-white shadow-md hover:brightness-110 transition-all"
              >
                <span className="text-xl mt-0.5">👥</span>
                <div>
                  <p className="font-semibold text-sm">Gerenciar Membros</p>
                  <p className="text-[11px] text-emerald-100 mt-0.5">
                    Cadastro e aniversariantes
                  </p>
                </div>
              </Link>

              {/* Serviços dos Irmãos */}
              <Link
                href="/admin/servicos"
                className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 px-4 py-3.5 text-white shadow-md hover:brightness-110 transition-all"
              >
                <span className="text-xl mt-0.5">🤝</span>
                <div>
                  <p className="font-semibold text-sm">Serviços dos Irmãos</p>
                  <p className="text-[11px] text-purple-100 mt-0.5">
                    Profissões e serviços da igreja
                  </p>
                </div>
              </Link>

              {/* Voluntários */}
              <Link
                href="/admin/voluntarios"
                className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-cyan-700 to-sky-500 px-4 py-3.5 text-white shadow-md hover:brightness-110 transition-all"
              >
                <span className="text-xl mt-0.5">🙋</span>
                <div>
                  <p className="font-semibold text-sm">Voluntários</p>
                  <p className="text-[11px] text-cyan-100 mt-0.5">
                    Equipes e áreas de serviço
                  </p>
                </div>
              </Link>

              {/* Página pública de serviços */}
              {urlServicosPublico ? (
                <a
                  href={urlServicosPublico}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-500 px-4 py-3.5 text-white shadow-md hover:brightness-110 transition-all"
                >
                  <span className="text-xl mt-0.5">🌐</span>
                  <div>
                    <p className="font-semibold text-sm">Página pública de serviços</p>
                    <p className="text-[11px] text-emerald-100 mt-0.5 break-all">
                      {urlServicosPublico}
                    </p>
                  </div>
                </a>
              ) : (
                <Link
                  href="/admin/servicos/publico"
                  className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-500 px-4 py-3.5 text-white shadow-md hover:brightness-110 transition-all"
                >
                  <span className="text-xl mt-0.5">🌐</span>
                  <div>
                    <p className="font-semibold text-sm">Página pública de serviços</p>
                    <p className="text-[11px] text-emerald-100 mt-0.5">
                      Link para divulgar aos membros
                    </p>
                  </div>
                </Link>
              )}

              {/* Página pública de voluntários */}
              {urlVoluntariosPublico ? (
                <a
                  href={urlVoluntariosPublico}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-cyan-700 to-teal-500 px-4 py-3.5 text-white shadow-md hover:brightness-110 transition-all"
                >
                  <span className="text-xl mt-0.5">🌐</span>
                  <div>
                    <p className="font-semibold text-sm">Página pública de voluntários</p>
                    <p className="text-[11px] text-cyan-100 mt-0.5 break-all">
                      {urlVoluntariosPublico}
                    </p>
                  </div>
                </a>
              ) : (
                <Link
                  href="/admin/voluntarios/publico"
                  className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-cyan-700 to-teal-500 px-4 py-3.5 text-white shadow-md hover:brightness-110 transition-all"
                >
                  <span className="text-xl mt-0.5">🌐</span>
                  <div>
                    <p className="font-semibold text-sm">Página pública de voluntários</p>
                    <p className="text-[11px] text-cyan-100 mt-0.5">
                      Para a igreja ver as equipes
                    </p>
                  </div>
                </Link>
              )}

              {/* Quero ser voluntário */}
              {urlInscricao ? (
                <a
                  href={urlInscricao}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-500 px-4 py-3.5 text-white shadow-md hover:brightness-110 transition-all"
                >
                  <span className="text-xl mt-0.5">✍️</span>
                  <div>
                    <p className="font-semibold text-sm">Quero ser voluntário</p>
                    <p className="text-[11px] text-lime-100 mt-0.5 break-all">
                      {urlInscricao}
                    </p>
                  </div>
                </a>
              ) : (
                <Link
                  href="/voluntarios/inscricao"
                  className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-500 px-4 py-3.5 text-white shadow-md hover:brightness-110 transition-all"
                >
                  <span className="text-xl mt-0.5">✍️</span>
                  <div>
                    <p className="font-semibold text-sm">Quero ser voluntário</p>
                    <p className="text-[11px] text-lime-100 mt-0.5">
                      Inscrição para novos voluntários
                    </p>
                  </div>
                </Link>
              )}

              {/* Display TV — link direto, sem slug */}
              <Link
                href="/display"
                className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-sky-700 to-indigo-600 px-4 py-3.5 text-white shadow-md hover:brightness-110 transition-all sm:col-span-2"
              >
                <span className="text-xl mt-0.5">📺</span>
                <div>
                  <p className="font-semibold text-sm">Tela de Display (TV)</p>
                  <p className="text-[11px] text-sky-100 mt-0.5">
                    Abrir painel de avisos para o telão da igreja
                  </p>
                </div>
              </Link>

            </div>
          </section>

          {/* COLUNA DIREITA - ADMINISTRAÇÃO */}
          {isAdmin && (
            <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/30">
              <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.18em] mb-5">
                Administração do Sistema
              </h2>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Controle de usuários, igrejas e configurações avançadas do painel.
              </p>

              <div className="flex flex-col gap-3">

                <Link
                  href="/admin/usuarios"
                  className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 px-4 py-3.5 text-white shadow-md hover:brightness-110 transition-all"
                >
                  <span className="text-xl mt-0.5">🔑</span>
                  <div>
                    <p className="font-semibold text-sm">Gerenciar Usuários</p>
                    <p className="text-[11px] text-amber-100 mt-0.5">
                      Aprovar acessos e definir administradores
                    </p>
                  </div>
                </Link>

                <Link
                  href="/admin/voluntario-areas"
                  className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-cyan-600 to-sky-500 px-4 py-3.5 text-white shadow-md hover:brightness-110 transition-all"
                >
                  <span className="text-xl mt-0.5">🧩</span>
                  <div>
                    <p className="font-semibold text-sm">Áreas de Voluntariado</p>
                    <p className="text-[11px] text-cyan-100 mt-0.5">
                      Ministérios e áreas de serviço
                    </p>
                  </div>
                </Link>

                <Link
                  href="/admin/tipos"
                  className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 px-4 py-3.5 text-white shadow-md hover:brightness-110 transition-all"
                >
                  <span className="text-xl mt-0.5">🏷️</span>
                  <div>
                    <p className="font-semibold text-sm">Tipos de Serviço</p>
                    <p className="text-[11px] text-orange-100 mt-0.5">
                      Classificar serviços dos irmãos
                    </p>
                  </div>
                </Link>

                <Link
                  href="/admin/igrejas"
                  className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-lime-500 to-emerald-500 px-4 py-3.5 text-white shadow-md hover:brightness-110 transition-all"
                >
                  <span className="text-xl mt-0.5">📍</span>
                  <div>
                    <p className="font-semibold text-sm">Gerenciar Igrejas</p>
                    <p className="text-[11px] text-lime-100 mt-0.5">
                      Cadastrar e configurar congregações
                    </p>
                  </div>
                </Link>

              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}