// src/app/api/voluntarios/route.ts
import { NextResponse } from 'next/server';
// REMOVA ESTA LINHA: import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma'; // <-- IMPORTA A INSTÂNCIA ÚNICA DO PRISMA

// REMOVA ESTA LINHA: const prisma = new PrismaClient();

// GET: Retorna todos os voluntários
export async function GET() {
  try {
    const voluntarios = await prisma.voluntario.findMany({
      include: {
        area: true, // Inclui os dados da área do voluntário
      },
      orderBy: {
        nome: 'asc', // Ordena por nome
      },
    });
    return NextResponse.json(voluntarios);
  } catch (error) {
    console.error('Erro ao buscar voluntários:', error);
    return NextResponse.json({ message: 'Erro ao buscar voluntários.' }, { status: 500 });
  }
}

// POST: Cria um novo voluntário
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, areaId, dons, telefone, email } = body;

    if (!nome || !areaId || !telefone) {
      return NextResponse.json({ message: 'Nome, área e telefone são obrigatórios.' }, { status: 400 });
    }

    const novoVoluntario = await prisma.voluntario.create({
      data: {
        nome,
        areaId: Number(areaId),
        dons,
        telefone,
        email,
        disponivel: false, // Por padrão, um novo voluntário é 'pendente' (não disponível/validado)
      },
    });
    return NextResponse.json(novoVoluntario, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar voluntário:', error);
    return NextResponse.json({ message: 'Erro ao criar voluntário.' }, { status: 500 });
  }
}