import Image from 'next/image';

interface PlayerCardProps {
  name: string;
  role: string;
  number?: number;
  image?: string;
}

export default function PlayerCard({ name, role, number, image }: PlayerCardProps) {
  const isStaff = role === 'Staff' || role === 'Allenatore';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden" 
      style={{ 
        width: '230px',             // Larghezza fissa: circa 5cm su uno schermo standard
        height: '322px',            // Altezza fissa: circa 7cm su uno schermo standard
        margin: '0 auto'            // Centrato orizzontalmente
      }}>
      {/* Immagine con dimensione fissa */}
      <div style={{ width: '100%', height: '250px', position: 'relative' }}>
        {image ? (
          <Image 
            src={image} 
            alt={name} 
            fill
            className="object-fill" 
            sizes="230px"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Contenuto stile figurina */}
      <div className="p-3 text-center flex flex-col justify-center bg-gray-50 border-t h-[72px]">
        <h3 className="text-base font-bold text-gray-800">{name}</h3>
        
        {!isStaff && number && (
          <div className="mt-1">
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-sm font-bold">
              {number}
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 