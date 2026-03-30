/*
  Warnings:

  - You are about to drop the `servico` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "servico";

-- CreateTable
CREATE TABLE "TipoServico" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "TipoServico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servico" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoId" INTEGER NOT NULL,
    "descricao" TEXT,
    "telefone" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoServico_nome_key" ON "TipoServico"("nome");

-- AddForeignKey
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "TipoServico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
