import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const seasons = await db.collection('seasons').find({}).toArray();
    const count = seasons.length;

    return NextResponse.json({ count, seasons, success: true });
  } catch (error) {
    console.error('Errore durante il conteggio delle stagioni:', error);
    return NextResponse.json(
      { error: 'Errore durante il conteggio delle stagioni', success: false },
      { status: 500 }
    );
  }
} 