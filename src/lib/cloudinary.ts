import { v2 as cloudinary } from 'cloudinary';

// Configura Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Debug delle credenziali per verifica (solo per sviluppo)
console.log('Cloudinary configurato:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? 'Presente' : 'Mancante',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'Presente' : 'Mancante',
});

// Definizione dei tipi per i risultati di Cloudinary
interface UploadResult {
  secure_url: string;
  public_id: string;
}

interface DeleteResult {
  result: string;
}

export const uploadImage = async (base64Image: string) => {
  try {
    console.log('Iniziando upload su Cloudinary...');
    
    // L'immagine è già in formato data URL (es. data:image/jpeg;base64,...)
    if (base64Image.startsWith('data:')) {
      console.log('Immagine in formato data URL');
      
      // Carica l'immagine su Cloudinary direttamente (supporta data URLs)
      const result = await new Promise<UploadResult>((resolve, reject) => {
        cloudinary.uploader.upload(
          base64Image,
          { 
            folder: 'fc_borghetto',
            resource_type: 'auto'
          },
          (error, result) => {
            if (error || !result) {
              console.error('Errore durante l\'upload:', error);
              return reject(error || new Error('Errore durante il caricamento dell\'immagine'));
            }
            console.log('Upload completato con successo');
            resolve(result as UploadResult);
          }
        );
      });
      
      console.log('URL immagine caricata:', result.secure_url);
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } else {
      throw new Error('Formato immagine non supportato');
    }
  } catch (error) {
    console.error('Errore durante il caricamento dell\'immagine su Cloudinary:', error);
    throw error;
  }
};

export const deleteImage = async (publicId: string) => {
  try {
    console.log('Eliminazione immagine con ID:', publicId);
    
    const result = await new Promise<DeleteResult>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error('Errore durante eliminazione:', error);
          return reject(error);
        }
        console.log('Immagine eliminata con successo');
        resolve(result as DeleteResult);
      });
    });
    
    return result;
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'immagine da Cloudinary:', error);
    throw error;
  }
};

export default cloudinary; 