-- CreateTable
CREATE TABLE "VoluntarioArea" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "VoluntarioArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voluntario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "areaId" INTEGER NOT NULL,
    "dons" TEXT,
    "telefone" TEXT NOT NULL,
    "email" TEXT,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Voluntario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VoluntarioArea_nome_key" ON "VoluntarioArea"("nome");

-- AddForeignKey
ALTER TABLE "Voluntario" ADD CONSTRAINT "Voluntario_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "VoluntarioArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
