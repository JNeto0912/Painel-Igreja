import { prisma } from '@/lib/prisma';

async function getServicos() {
  return prisma.servico.findMany({
    orderBy: { criadoEm: 'asc' },
  });
}

export default async function ServicosPage() {
  const servicos = await getServicos();

  // ---------- ação de criar ----------
  async function criarServico(formData: FormData) {
    'use server';

    const nome = String(formData.get('nome') ?? '').trim();
    const tipo = String(formData.get('tipo') ?? '').trim();
    const telefone = String(formData.get('telefone') ?? '').trim();
    const descricao = String(formData.get('descricao') ?? '').trim();

    if (!nome || !tipo || !telefone) return;

    await prisma.servico.create({
      data: {
        nome,
        tipo,
        telefone,
        descricao: descricao || null,
      },
    });
  }

  // ---------- ação de remover ----------
  async function removerServico(formData: FormData) {
    'use server';

    const id = Number(formData.get('id'));
    if (!id) return;

    await prisma.servico.delete({
      where: { id },
    });
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Serviços dos Irmãos</h1>

      <p className="text-sm text-gray-600 mb-6">
        Cadastre aqui irmãos que oferecem serviços (cabeleireiro, pintor,
        eletricista, etc.). A igreja apenas divulga o contato; não se
        responsabiliza pelos serviços prestados.
      </p>

      {/* ---------- Formulário de cadastro ---------- */}
      <form action={criarServico} className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold mb-2">Novo serviço</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da pessoa ou empresa
            </label>
            <input
              type="text"
              name="nome"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de serviço
            </label>
            <input
              type="text"
              name="tipo"
              placeholder="Ex.: Cabeleireiro, Pintor, Eletricista"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone / WhatsApp
            </label>
            <input
              type="text"
              name="telefone"
              placeholder="(11) 99999‑9999"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição (opcional)
            </label>
            <textarea
              name="descricao"
              rows={2}
              placeholder="Ex.: Atendo em domicílio, horário comercial, cortes femininos e masculinos..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
        >
          Salvar serviço
        </button>
      </form>

      {/* ---------- Lista de serviços ---------- */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">Nome</th>
              <th className="text-left px-4 py-3">Serviço</th>
              <th className="text-left px-4 py-3">Telefone</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {servicos.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  Nenhum serviço cadastrado ainda.
                </td>
              </tr>
            )}
            {servicos.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-4 py-3 font-medium">{s.nome}</td>
                <td className="px-4 py-3">{s.tipo}</td>
                <td className="px-4 py-3">{s.telefone}</td>
                <td className="px-4 py-3 text-right">
                  <form action={removerServico}>
                    <input type="hidden" name="id" value={s.id} />
                    <button
                      type="submit"
                      className="text-red-500 hover:text-red-700 text-xs font-semibold"
                    >
                      Remover
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}