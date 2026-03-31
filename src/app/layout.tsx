// src/app/layout.tsx

// Importa o arquivo CSS global (onde o Tailwind é configurado)
import './globals.css'; // Certifique-se de que o caminho está correto!

// Importa uma fonte do Google Fonts (ex: Inter)
// Se você não quiser usar uma fonte específica, pode remover esta importação e o className no <html>
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'], // Define os subconjuntos de caracteres da fonte
  display: 'swap',    // Garante que a fonte seja exibida corretamente
});

// Metadados da aplicação (opcional, mas recomendado para SEO)
export const metadata = {
  title: 'Painel da Igreja',
  description: 'Sistema de gerenciamento para a igreja',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // O <html> deve ter a propriedade lang e, opcionalmente, o className da fonte
    <html lang="pt-BR" className={inter.className}>
      <body>
        {/*
          O 'children' representa o conteúdo das suas páginas e layouts aninhados.
          Ele será renderizado dentro do <body>.
        */}
        {children}
      </body>
    </html>
  );
}