export interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
}

export interface GoogleBooksResponse {
  items?: Array<{
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      imageLinks?: {
        smallThumbnail?: string;
        thumbnail?: string;
        small?: string;
        medium?: string;
        large?: string;
        extraLarge?: string;
      };
      description?: string;
      publishedDate?: string;
      pageCount?: number;
      categories?: string[];
    };
  }>;
}

export async function searchBooks(query: string, maxResults: number = 20): Promise<Book[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&langRestrict=en`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    
    const data: GoogleBooksResponse = await response.json();
    
    if (!data.items) {
      return [];
    }
    
    return data.items.map((item) => {
      // Get highest quality image available
      const imageLinks = item.volumeInfo.imageLinks;
      let thumbnail = '';
      
      if (imageLinks) {
        // Try to get higher quality images, fallback to smaller ones
        thumbnail = imageLinks.extraLarge?.replace('http://', 'https://') ||
                   imageLinks.large?.replace('http://', 'https://') ||
                   imageLinks.medium?.replace('http://', 'https://') ||
                   imageLinks.small?.replace('http://', 'https://') ||
                   imageLinks.thumbnail?.replace('http://', 'https://') ||
                   imageLinks.smallThumbnail?.replace('http://', 'https://') ||
                   '';
        
        // Enhance image quality by removing size restrictions and adding quality parameters
        if (thumbnail) {
          // Remove existing zoom and edge parameters
          thumbnail = thumbnail.replace(/&zoom=\d+/, '');
          thumbnail = thumbnail.replace(/&edge=curl/, '');
          
          // If it's a Google Books thumbnail, enhance it for higher quality
          // Replace sz=thumbnail with sz=large or remove size restriction
          thumbnail = thumbnail.replace(/sz=thumbnail/i, 'sz=large');
          thumbnail = thumbnail.replace(/sz=small/i, 'sz=large');
          thumbnail = thumbnail.replace(/sz=medium/i, 'sz=large');
          
          // Add zoom parameter for maximum quality (zoom=0 means original size)
          if (!thumbnail.includes('zoom=')) {
            thumbnail += (thumbnail.includes('?') ? '&' : '?') + 'zoom=0';
          }
        }
      }
      
      return {
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ['Unknown Author'],
        thumbnail,
        description: item.volumeInfo.description,
        publishedDate: item.volumeInfo.publishedDate,
        pageCount: item.volumeInfo.pageCount,
        categories: item.volumeInfo.categories,
      };
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

export async function getPopularBooks(): Promise<Book[]> {
  // Search for popular books across different genres
  const queries = [
    'bestseller fiction',
    'bestseller non-fiction',
    'popular romance',
    'popular fantasy',
    'popular mystery',
  ];
  
  const allBooks: Book[] = [];
  
  for (const query of queries) {
    const books = await searchBooks(query, 4);
    allBooks.push(...books);
  }
  
  // Remove duplicates and shuffle
  const uniqueBooks = Array.from(
    new Map(allBooks.map(book => [book.id, book])).values()
  );
  
  return uniqueBooks.slice(0, 20);
}



