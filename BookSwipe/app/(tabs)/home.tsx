import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Swiper, type SwiperCardRefType } from 'rn-swiper-list';
import { getPopularBooks, type Book } from '../../services/googleBooks';
import { generateShortDescription } from '../../services/llm';
import { saveMatch } from '../../services/matchesStorage';

interface BookWithDescription extends Book {
  shortDescription?: string;
  imageLoading?: boolean;
}

const App = () => {
  const ref = useRef<SwiperCardRefType | null>(null);
  const [books, setBooks] = useState<BookWithDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardLoading, setCardLoading] = useState(false);
  const [imageLoadStates, setImageLoadStates] = useState<Record<number, boolean>>({});

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const fetchedBooks = await getPopularBooks();
      
      // Generate short descriptions for books using LLM
      setCardLoading(true);
      const booksWithDescriptions = await Promise.all(
        fetchedBooks.slice(0, 10).map(async (book, index) => {
          const shortDescription = await generateShortDescription(
            book.title,
            book.authors[0] || 'Unknown',
            book.description
          );
          return { ...book, shortDescription, imageLoading: true };
        })
      );
      
      setBooks(booksWithDescriptions);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
      setCardLoading(false);
    }
  };

  const handleSwipeLeft = useCallback(() => {
    if (ref.current && currentIndex < books.length) {
      ref.current.swipeLeft();
    }
  }, [currentIndex, books.length]);

  const handleSwipeRight = useCallback(() => {
    if (ref.current && currentIndex < books.length) {
      ref.current.swipeRight();
    }
  }, [currentIndex, books.length]);

  // Keyboard controls for web (always enabled for hackathon demo)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleKeyDown = (event: globalThis.KeyboardEvent) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          handleSwipeLeft();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          handleSwipeRight();
        } else if (event.key === ' ' || event.key === 'Spacebar') {
          event.preventDefault();
          // Trigger card flip by simulating a click on the card
          // The Swiper component handles flip via onPress
          if (typeof document !== 'undefined') {
            // Find the active card and trigger click
            setTimeout(() => {
              const cards = document.querySelectorAll('[style*="transform"]');
              if (cards.length > 0) {
                // Get the topmost card (active one)
                const activeCard = Array.from(cards).find(card => {
                  const style = (card as HTMLElement).style.transform;
                  return style && !style.includes('translateX');
                }) as HTMLElement;
                if (activeCard) {
                  activeCard.click();
                } else if (cards[0]) {
                  (cards[0] as HTMLElement).click();
                }
              }
            }, 10);
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleSwipeLeft, handleSwipeRight]);

  const handleImageLoad = (index: number) => {
    setImageLoadStates(prev => ({ ...prev, [index]: true }));
  };

  const handleImageError = (index: number) => {
    setImageLoadStates(prev => ({ ...prev, [index]: false }));
  };

  const renderCard = useCallback((book: BookWithDescription, index: number) => {
    const imageUri = book.thumbnail || 'https://via.placeholder.com/400x600?text=No+Image';
    const isLoading = imageLoadStates[index] === undefined || imageLoadStates[index] === false;
    
    return (
      <View style={styles.renderCardContainer}>
        {isLoading && (
          <View style={styles.imageLoadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}
        <Image
          source={{ uri: imageUri }}
          style={styles.renderCardImage}
          resizeMode="cover"
          onLoad={() => handleImageLoad(index)}
          onError={() => handleImageError(index)}
        />
        <View style={styles.cardOverlay}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {book.title}
            </Text>
            <Text style={styles.cardAuthor} numberOfLines={1}>
              by {book.authors.join(', ')}
            </Text>
            {book.publishedDate && (
              <Text style={styles.cardYear}>{book.publishedDate.split('-')[0]}</Text>
            )}
            {book.shortDescription && (
              <Text style={styles.cardDescription} numberOfLines={3}>
                {book.shortDescription}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  }, [imageLoadStates]);

  const renderFlippedCard = useCallback((book: BookWithDescription, index: number) => {
    return (
      <ScrollView style={styles.renderFlippedCardContainer} contentContainerStyle={styles.flippedContent}>
        <Text style={styles.flippedTitle}>{book.title}</Text>
        <Text style={styles.flippedAuthor}>by {book.authors.join(', ')}</Text>
        {book.publishedDate && (
          <Text style={styles.flippedYear}>Published: {book.publishedDate.split('-')[0]}</Text>
        )}
        {book.pageCount && (
          <Text style={styles.flippedPages}>{book.pageCount} pages</Text>
        )}
        {book.categories && book.categories.length > 0 && (
          <View style={styles.categoriesContainer}>
            {book.categories.slice(0, 3).map((cat, i) => (
              <View key={i} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{cat}</Text>
              </View>
            ))}
          </View>
        )}
        <Text style={styles.flippedDescription}>
          {book.shortDescription || book.description || 'No description available.'}
        </Text>
      </ScrollView>
    );
  }, []);

  const OverlayLabelRight = useCallback(() => {
    return (
      <View style={[styles.overlayLabelContainer, styles.likeOverlay]}>
        <Text style={styles.overlayText}>LIKE</Text>
      </View>
    );
  }, []);
  
  const OverlayLabelLeft = useCallback(() => {
    return (
      <View style={[styles.overlayLabelContainer, styles.passOverlay]}>
        <Text style={styles.overlayText}>PASS</Text>
      </View>
    );
  }, []);

  if (loading) {
    return (
      <LinearGradient
        colors={['#FF6B35', '#F7931E', '#FFB347']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading books...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (books.length === 0) {
    return (
      <LinearGradient
        colors={['#FF6B35', '#F7931E', '#FFB347']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No books found. Please try again.</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#FF6B35', '#F7931E', '#FFB347']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.subContainer}>
        {cardLoading && (
          <View style={styles.cardLoadingOverlay}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.cardLoadingText}>Loading next card...</Text>
          </View>
        )}
        <Swiper
            ref={ref}
            data={books}
            initialIndex={0}
            cardStyle={styles.cardStyle}
            overlayLabelContainerStyle={styles.overlayLabelContainerStyle}
            renderCard={(book, index) => renderCard(book as BookWithDescription, index)}
          onIndexChange={(index: number) => {
            setCurrentIndex(index);
            setCardLoading(false);
            console.log('Current Active index', index);
          }}
          onSwipeRight={(cardIndex: number) => {
            const likedBook = books[cardIndex];
            if (likedBook) {
              console.log('Liked book:', likedBook.title);
              saveMatch(likedBook);
            }
            setCardLoading(true);
          }}
          onPress={() => {
            // Card flip is handled by Swiper component internally
            console.log('Card pressed - flip triggered');
          }}
          onSwipedAll={() => {
            console.log('onSwipedAll');
            // Reload books when all swiped
            loadBooks();
          }}
          FlippedContent={(book, index) => renderFlippedCard(book as BookWithDescription, index)}
          onSwipeLeft={(cardIndex: number) => {
            console.log('Passed book:', books[cardIndex]?.title);
            setCardLoading(true);
          }}
          OverlayLabelRight={OverlayLabelRight}
          OverlayLabelLeft={OverlayLabelLeft}
        />
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>
            {currentIndex + 1} / {books.length}
          </Text>
        </View>
        <View style={styles.keyboardHints}>
          <View style={styles.hintItem}>
            <View style={[styles.keyHint, styles.passKey]}>
              <Text style={styles.keyText}>←</Text>
            </View>
            <Text style={styles.hintText}>Pass</Text>
          </View>
          <View style={styles.hintItem}>
            <View style={[styles.keyHint, styles.flipKey]}>
              <Text style={[styles.keyText, styles.spaceKeyText]}>SPACE</Text>
            </View>
            <Text style={styles.hintText}>Flip</Text>
          </View>
          <View style={styles.hintItem}>
            <View style={[styles.keyHint, styles.likeKey]}>
              <Text style={styles.keyText}>→</Text>
            </View>
            <Text style={styles.hintText}>Like</Text>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
    </LinearGradient>
  );
};

export default App;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    width: '100%',
    minHeight: '100vh' as any,
  } as any,
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    minHeight: '100vh' as any,
    width: '100%',
  } as any,
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  renderCardContainer: {
    borderRadius: 15,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  renderCardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: '#f0f0f0',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  cardContent: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardAuthor: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  cardYear: {
    fontSize: 14,
    color: '#b0b0b0',
    marginTop: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#e0e0e0',
    marginTop: 8,
    lineHeight: 18,
  },
  renderFlippedCardContainer: {
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: '100%',
    padding: 24,
  },
  flippedContent: {
    flexGrow: 1,
  },
  flippedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  flippedAuthor: {
    fontSize: 18,
    color: '#0F172A',
    marginBottom: 4,
    opacity: 0.8,
  },
  flippedYear: {
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 4,
    opacity: 0.7,
  },
  flippedPages: {
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 16,
    opacity: 0.7,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryTag: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  flippedDescription: {
    fontSize: 16,
    color: '#0F172A',
    lineHeight: 24,
    opacity: 0.9,
  },
  cardStyle: {
    width: 400,
    maxWidth: 400,
    height: 600,
    maxHeight: 600,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  overlayLabelContainer: {
    borderRadius: 15,
    height: 600,
    width: 400,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
  },
  likeOverlay: {
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
    borderColor: '#22c55e',
  },
  passOverlay: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    borderColor: '#ef4444',
  },
  overlayText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  overlayLabelContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBar: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  keyboardHints: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
    zIndex: 10,
  },
  hintItem: {
    alignItems: 'center',
    gap: 8,
  },
  keyHint: {
    minWidth: 50,
    paddingHorizontal: 12,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  flipKey: {
    borderColor: '#FF6B35',
    minWidth: 70,
  },
  passKey: {
    borderColor: '#ef4444',
  },
  likeKey: {
    borderColor: '#22c55e',
  },
  keyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  spaceKeyText: {
    fontSize: 12,
    fontWeight: '800',
  },
  hintText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cardLoadingOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  } as any,
  cardLoadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
});
