// Simple in-memory storage for matches (for hackathon demo)
// In production, this would use AsyncStorage or a database

import { Book } from './googleBooks';

interface Match extends Book {
  matchedAt: string;
}

let matches: Match[] = [];

export function saveMatch(book: Book): void {
  // Check if already matched
  if (!matches.find(m => m.id === book.id)) {
    matches.push({
      ...book,
      matchedAt: new Date().toISOString(),
    });
  }
}

export function getMatches(): Match[] {
  return [...matches]; // Return a copy
}

export function clearMatches(): void {
  matches = [];
}




