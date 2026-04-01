// src/lib/datas.ts

// Formata data para exibição dd/mm/aaaa em São Paulo
export function formatarDataBR(data: Date | string) {
  return new Date(data).toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });
}

/**
 * Converte string de input type="date" (YYYY-MM-DD) para Date
 * de forma segura, evitando cair no dia anterior em UTC.
 */
export function parseDateFromInput(valor: string): Date {
  const [ano, mes, dia] = valor.split('-').map(Number);
  // cria como data "local" ao meio‑dia, para não correr risco com fuso
  return new Date(ano, mes - 1, dia, 12, 0, 0);
}

/**
 * Converte Date/ISO para string "YYYY-MM-DD" para preencher input type="date"
 * respeitando o fuso de São Paulo.
 */
export function toInputDate(value: Date | string) {
  const d = new Date(value);
  // 'sv-SE' => 2026-04-01
  return d.toLocaleDateString('sv-SE', {
    timeZone: 'America/Sao_Paulo',
  });
}