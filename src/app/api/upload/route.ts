import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'painel-igreja',
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result as { secure_url: string });
        }
      ).end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { error: 'Falha ao enviar imagem' },
      { status: 500 }
    );
  }
}