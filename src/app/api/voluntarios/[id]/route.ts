// src/app/api/voluntarios/[id]/route.ts
import { NextResponse } from 'next/server';
// REMOVA ESTA LINHA: import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma'; // <-- IMPORTA A INSTÂNCIA ÚNICA DO PRISMA

// REMOVA ESTA LINHA: const prisma = new PrismaClient();

// GET: Retorna um voluntário específico pelo ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const voluntario = await prisma.voluntario.findUnique({
      where: { id },
      include: { area: true },
    });

    if (!voluntario) {
      return NextResponse.json({ message: 'Voluntário não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(voluntario);
  } catch (error) {
    console.error('Erro ao buscar voluntário:', error);
    return NextResponse.json({ message: 'Erro ao buscar voluntário.' }, { status: 500 });
  }
}

// PUT: Atualiza um voluntário específico pelo ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const { nome, areaId, dons, telefone, email, disponivel } = body;

    if (!nome || !areaId || !telefone) {
      return NextResponse.json({ message: 'Nome, área e telefone são obrigatórios.' }, { status: 400 });
    }

    const voluntarioAtualizado = await prisma.voluntario.update({
      where: { id },
      data: {
        nome,
        areaId: Number(areaId),
        dons,
        telefone,
        email,
        disponivel: typeof disponivel === 'boolean' ? disponivel : undefined, // Permite atualizar o status
      },
    });
    return NextResponse.json(voluntarioAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar voluntário:', error);
    return NextResponse.json({ message: 'Erro ao atualizar voluntário.' }, { status: 500 });
  }
}

// DELETE: Exclui um voluntário específico pelo ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await prisma.voluntario.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Voluntário excluído com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao excluir voluntário:', error);
    return NextResponse.json({ message: 'Erro ao excluir voluntário.' }, { status: 500 });
  }
}