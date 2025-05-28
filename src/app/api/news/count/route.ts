import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const count = await db.collection('news').countDocuments();

    return NextResponse.json({ count, success: true });
  } catch (error) {
    console.error('Errore durante il conteggio delle news:', error);
    return NextResponse.json(
      { error: 'Errore durante il conteggio delle news', success: false },
      { status: 500 }
    );
  }
} 