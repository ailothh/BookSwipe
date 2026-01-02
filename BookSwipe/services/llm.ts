// LLM service for generating short book descriptions
// Using Groq API (free, fast LLM) - requires free API key from console.groq.com
// Falls back to smart text processing if API key not provided

export async function generateShortDescription(
  title: string,
  author: string,
  originalDescription?: string
): Promise<string> {
  // Try Groq API first (free, fast, uses Llama models)
  // Get API key from: https://console.groq.com (free account)
  // Set EXPO_PUBLIC_GROQ_API_KEY in your .env file or expo config
  // For web, also check window.env or Constants
  let apiKey: string | undefined;
  
  if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_GROQ_API_KEY) {
    apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  } else if (typeof window !== 'undefined' && (window as any).ENV?.EXPO_PUBLIC_GROQ_API_KEY) {
    apiKey = (window as any).ENV.EXPO_PUBLIC_GROQ_API_KEY;
  }
  
  if (apiKey) {
    try {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant', // Fast, free model on Groq
          messages: [
            {
              role: 'system',
              content: 'You are a book reviewer. Write a short, engaging 2-3 sentence description (under 150 characters) that makes people want to read the book. Be concise, compelling, and highlight what makes it special.',
            },
            {
              role: 'user',
              content: `Book: "${title}" by ${author}.${originalDescription ? `\n\nOriginal description: ${originalDescription.substring(0, 400)}` : ''}\n\nWrite a short, engaging description (under 150 characters):`,
            },
          ],
          max_tokens: 100,
          temperature: 0.7,
        }),
      });

      if (groqResponse.ok) {
        const data = await groqResponse.json();
        const description = data.choices[0]?.message?.content?.trim();
        if (description) {
          return description;
        }
      } else {
        const errorData = await groqResponse.json().catch(() => ({}));
        console.log('Groq API error:', errorData);
      }
    } catch (error) {
      console.log('Groq API unavailable, using smart fallback...', error);
    }
  } else {
    console.log('Groq API key not found. Using smart fallback. Get free key at: https://console.groq.com');
  }

  // Smart fallback: create engaging description from available info
  return getFallbackDescription(title, author, originalDescription);
}

function makeDescriptionEngaging(text: string, title: string, author: string): string {
  // Ensure it starts with an engaging phrase if it doesn't already
  const engagingStarters = [
    'Discover',
    'Experience',
    'Dive into',
    'Explore',
    'Journey through',
    'Uncover',
  ];
  
  const firstWord = text.split(' ')[0];
  if (!engagingStarters.some(starter => firstWord.toLowerCase().includes(starter.toLowerCase()))) {
    // Add an engaging starter if needed
    return `Discover ${text.toLowerCase()}`;
  }
  
  return text;
}

function getFallbackDescription(title: string, author: string, originalDescription?: string): string {
  if (originalDescription) {
    // Smart truncation: find the last complete sentence within 150 chars
    let truncated = originalDescription.substring(0, 150);
    
    // Try to end at a sentence boundary
    const lastPeriod = truncated.lastIndexOf('.');
    const lastExclamation = truncated.lastIndexOf('!');
    const lastQuestion = truncated.lastIndexOf('?');
    const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
    
    if (lastSentenceEnd > 100) {
      // Use the sentence boundary if it's not too short
      truncated = truncated.substring(0, lastSentenceEnd + 1);
    } else {
      // Otherwise truncate at word boundary
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace > 120) {
        truncated = truncated.substring(0, lastSpace) + '...';
      } else {
        truncated = truncated + '...';
      }
    }
    
    // Make it more engaging
    if (!truncated.toLowerCase().startsWith('discover') && 
        !truncated.toLowerCase().startsWith('experience') &&
        !truncated.toLowerCase().startsWith('dive')) {
      truncated = `Discover ${truncated.toLowerCase()}`;
    }
    
    return truncated;
  }
  
  // Generate a generic but engaging description based on title
  const titleWords = title.toLowerCase().split(' ');
  const genreHints: Record<string, string> = {
    'love': 'A heartwarming tale',
    'murder': 'A gripping mystery',
    'magic': 'An enchanting adventure',
    'war': 'A powerful story',
    'space': 'An epic journey',
    'secret': 'A thrilling discovery',
  };
  
  let starter = 'A captivating read';
  for (const [hint, phrase] of Object.entries(genreHints)) {
    if (titleWords.some(word => word.includes(hint))) {
      starter = phrase;
      break;
    }
  }
  
  return `${starter} by ${author}. This engaging story will keep you turning pages.`;
}

