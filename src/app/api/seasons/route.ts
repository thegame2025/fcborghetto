import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import { uploadImage } from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    
    const seasons = await db.collection('seasons')
      .find({})
      .sort({ year: -1 })
      .toArray();
    
    return NextResponse.json({ seasons }, { status: 200 });
  } catch (error) {
    console.error('Error fetching seasons:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // @ts-ignore - Ignoring type error for now
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { db } = await connectToDatabase();
    const data = await request.json();
    
    // Validate required fields
    if (!data.year || !data.name) {
      return NextResponse.json({ error: 'Year and name are required' }, { status: 400 });
    }
    
    // Process image if provided
    if (data.image && data.image.startsWith('data:')) {
      const uploadResult = await uploadImage(data.image);
      data.image = uploadResult.url;
    }
    
    // Process player images if provided
    if (data.players && Array.isArray(data.players)) {
      for (let i = 0; i < data.players.length; i++) {
        if (data.players[i].image && data.players[i].image.startsWith('data:')) {
          const uploadResult = await uploadImage(data.players[i].image);
          data.players[i].image = uploadResult.url;
        }
      }
    }
    
    const result = await db.collection('seasons').insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ 
      success: true, 
      seasonId: result.insertedId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating season:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 