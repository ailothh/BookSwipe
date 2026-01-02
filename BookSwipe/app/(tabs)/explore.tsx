import React, { useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { searchBooks } from '../../services/googleBooks';

const curatedLists = [
  { title: 'Trending This Week', query: 'bestseller fiction 2024', color: '#FF6B35' },
  { title: 'Critically Acclaimed', query: 'award winning books', color: '#FF6B35' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleListPress = async (list: typeof curatedLists[0]) => {
    setSelectedList(list.title);
    setLoading(true);
    try {
      const fetchedBooks = await searchBooks(list.query, 20);
      setBooks(fetchedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FF6B35', '#F7931E', '#FFB347']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Find new books by vibe, mood, or genre.</Text>

        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search books, authors, or genres"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Curated rails</Text>
          <View style={styles.cardGrid}>
            {curatedLists.map(list => (
              <Pressable
                key={list.title}
                onPress={() => handleListPress(list)}
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.cardPressed
                ]}>
                <Text style={styles.cardTitle}>{list.title}</Text>
                <Text style={styles.cardCount}>Tap to open the rail</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading books...</Text>
          </View>
        )}

        {selectedList && books.length > 0 && (
          <View style={styles.booksSection}>
            <Text style={styles.booksSectionTitle}>{selectedList}</Text>
            <FlatList
              horizontal
              data={books}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingRight: 16 }}
              renderItem={({ item }) => (
                <View style={styles.bookCard}>
                  {item.thumbnail && (
                    <Image 
                      source={{ uri: item.thumbnail }} 
                      style={styles.bookImage}
                      resizeMode="cover"
                    />
                  )}
                  <Text style={styles.bookTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.bookAuthor} numberOfLines={1}>
                    {item.authors[0]}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 6,
    fontSize: 15,
  },
  searchBox: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    color: '#0F172A',
    fontSize: 16,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 12,
  },
  cardGrid: {
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF6B35',
  },
  cardCount: {
    color: '#64748B',
    marginTop: 6,
    fontSize: 14,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  booksSection: {
    marginTop: 24,
  },
  booksSectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  bookCard: {
    width: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  bookImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#64748B',
  },
});
