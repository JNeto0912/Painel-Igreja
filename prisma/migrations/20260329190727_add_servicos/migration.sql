/*
  Warnings:

  - You are about to drop the `Servico` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Servico";

-- CreateTable
CREATE TABLE "servico" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT,
    "telefone" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servico_pkey" PRIMARY KEY ("id")
);
