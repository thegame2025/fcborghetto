import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

// GET /api/site-config
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    const config = await db.collection('site_config').findOne({});
    
    if (!config) {
      return NextResponse.json({}, { status: 404 });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Errore durante il recupero della configurazione del sito:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero della configurazione del sito' },
      { status: 500 }
    );
  }
}

// PUT /api/site-config
export async function PUT(request: NextRequest) {
  try {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    const updateData = await request.json();
    
    // Rimuovi i campi undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    
    // Processa l'immagine logo se presente
    if (updateData.logo && updateData.logo.startsWith('data:')) {
      try {
        const uploadResult = await uploadImage(updateData.logo);
        updateData.logo = uploadResult.url;
      } catch (error) {
        console.error('Errore durante il caricamento del logo:', error);
      }
    }
    
    // Processa l'immagine home se presente
    if (updateData.homeImage && updateData.homeImage.startsWith('data:')) {
      try {
        const uploadResult = await uploadImage(updateData.homeImage);
        updateData.homeImage = uploadResult.url;
      } catch (error) {
        console.error('Errore durante il caricamento dell\'immagine home:', error);
      }
    }
    
    // Processa l'immagine about se presente
    if (updateData.aboutImage && updateData.aboutImage.startsWith('data:')) {
      try {
        const uploadResult = await uploadImage(updateData.aboutImage);
        updateData.aboutImage = uploadResult.url;
      } catch (error) {
        console.error('Errore durante il caricamento dell\'immagine about:', error);
      }
    }
    
    // Aggiorna solo i campi presenti
    await db.collection('site_config').updateOne(
      {}, // primo documento trovato
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        } 
      },
      { upsert: true } // crea il documento se non esiste
    );
    
    const updatedConfig = await db.collection('site_config').findOne({});
    
    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della configurazione del sito:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'aggiornamento della configurazione del sito' },
      { status: 500 }
    );
  }
} 