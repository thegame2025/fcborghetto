import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import { uploadImage } from '@/lib/cloudinary';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    const season = await db.collection('seasons').findOne({
      _id: new ObjectId(id)
    });
    
    if (!season) {
      return NextResponse.json({ error: 'Season not found' }, { status: 404 });
    }
    
    return NextResponse.json(season, { status: 200 });
  } catch (error) {
    console.error('Error fetching season:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // @ts-ignore - Ignoring type error for now
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    const data = await request.json();
    
    // Validate required fields
    if (!data.year || !data.name) {
      return NextResponse.json({ error: 'Year and name are required' }, { status: 400 });
    }
    
    // Process image if provided and it's a new upload
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
    
    const result = await db.collection('seasons').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...data,
          updatedAt: new Date()
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Season not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true,
      updated: result.modifiedCount > 0 
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating season:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // @ts-ignore - Ignoring type error for now
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    const result = await db.collection('seasons').deleteOne({
      _id: new ObjectId(id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Season not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true 
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting season:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 