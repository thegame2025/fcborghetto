import Link from 'next/link';
import Image from 'next/image';
import { FaCalendarAlt } from 'react-icons/fa';

interface NewsCardProps {
  id: string;
  title: string;
  content: string;
  image?: string | null;
  publishedAt: string;
  truncateLength?: number;
}

export default function NewsCard({ id, title, content, image, publishedAt, truncateLength = 150 }: NewsCardProps) {
  // Strip HTML tags and limit content length
  const plainTextContent = content.replace(/<[^>]*>/g, '');
  const truncatedContent = plainTextContent.length > truncateLength 
    ? `${plainTextContent.substring(0, truncateLength)}...` 
    : plainTextContent;

  // Format the date
  const formattedDate = new Date(publishedAt).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Link href={`/news/${id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 w-full">
        {image ? (
          <Image 
            src={image} 
            alt={title} 
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-4xl">FC</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Date */}
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <FaCalendarAlt className="mr-2" />
          {formattedDate}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        
        {/* Content preview */}
        <p className="text-gray-600 mb-4">
          {truncatedContent}
        </p>
        
        {/* Read more */}
        <div className="text-right">
          <span className="text-blue-600 hover:text-blue-800 font-medium">Leggi di più &rarr;</span>
        </div>
      </div>
    </Link>
  );
} 