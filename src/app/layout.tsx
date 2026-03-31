// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import Image from 'next/image';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

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
    <html lang="pt-BR" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        {/* Conteúdo principal */}
        <main className="flex-1">
          {children}
        </main>

        {/* "Rodapé" com logo + frase, tudo embaixo e lado a lado */}
        <footer className="w-full flex flex-col items-center justify-center gap-2 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/uploads/resolult.png"   // seu logo em public/uploads
              alt="Logotipo do Projeto"
              width={120}               // ajuste o tamanho como quiser
              height={120}
            />
            <div className="flex flex-col">
              <span className="italic text-sm text-center">
                "Transformar desafios em resultados concretos."
              </span>
              <span className="text-xs text-center mt-1">
                Desenvolvido por Neto
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}