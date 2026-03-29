export function parseDateBR(dataString: string): Date {
  // Recebe "2026-03-27" e converte para meio-dia em Brasília
  // evitando que UTC subtraia horas e mude o dia
  const [ano, mes, dia] = dataString.split('-').map(Number);
  // meio-dia horário de Brasília = 15:00 UTC
  return new Date(Date.UTC(ano, mes - 1, dia, 15, 0, 0));
}