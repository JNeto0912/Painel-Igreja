-- Cria tabela Igreja
CREATE TABLE "Igreja" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "endereco" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "cep" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Igreja_pkey" PRIMARY KEY ("id")
);

-- Índice único para slug
CREATE UNIQUE INDEX "Igreja_slug_key" ON "Igreja"("slug");

-- Insere a primeira igreja para os dados existentes
INSERT INTO "Igreja" ("nome", "slug") VALUES ('Igreja Padrão', 'padrao');

-- =====================
-- Usuario
-- =====================
ALTER TABLE "Usuario" ADD COLUMN "igrejaId" INTEGER;
UPDATE "Usuario" SET "igrejaId" = 1 WHERE "igrejaId" IS NULL;
ALTER TABLE "Usuario" ALTER COLUMN "igrejaId" SET NOT NULL;
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_igrejaId_fkey"
  FOREIGN KEY ("igrejaId") REFERENCES "Igreja"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- =====================
-- Aviso
-- =====================
ALTER TABLE "Aviso" ADD COLUMN "igrejaId" INTEGER;
UPDATE "Aviso" SET "igrejaId" = 1 WHERE "igrejaId" IS NULL;
ALTER TABLE "Aviso" ALTER COLUMN "igrejaId" SET NOT NULL;
ALTER TABLE "Aviso" ADD CONSTRAINT "Aviso_igrejaId_fkey"
  FOREIGN KEY ("igrejaId") REFERENCES "Igreja"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- =====================
-- Membro
-- =====================
ALTER TABLE "Membro" ADD COLUMN "igrejaId" INTEGER;
UPDATE "Membro" SET "igrejaId" = 1 WHERE "igrejaId" IS NULL;
ALTER TABLE "Membro" ALTER COLUMN "igrejaId" SET NOT NULL;
ALTER TABLE "Membro" ADD CONSTRAINT "Membro_igrejaId_fkey"
  FOREIGN KEY ("igrejaId") REFERENCES "Igreja"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- =====================
-- Servico
-- =====================
ALTER TABLE "Servico" ADD COLUMN "igrejaId" INTEGER;
UPDATE "Servico" SET "igrejaId" = 1 WHERE "igrejaId" IS NULL;
ALTER TABLE "Servico" ALTER COLUMN "igrejaId" SET NOT NULL;
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_igrejaId_fkey"
  FOREIGN KEY ("igrejaId") REFERENCES "Igreja"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- =====================
-- Voluntario
-- =====================
ALTER TABLE "Voluntario" ADD COLUMN "igrejaId" INTEGER;
UPDATE "Voluntario" SET "igrejaId" = 1 WHERE "igrejaId" IS NULL;
ALTER TABLE "Voluntario" ALTER COLUMN "igrejaId" SET NOT NULL;
ALTER TABLE "Voluntario" ADD CONSTRAINT "Voluntario_igrejaId_fkey"
  FOREIGN KEY ("igrejaId") REFERENCES "Igreja"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;