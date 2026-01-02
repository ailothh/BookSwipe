import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getMatches } from '../../services/matchesStorage';

export default function MatchesScreen() {
  const [matches, setMatches] = useState(getMatches());

  useEffect(() => {
    // Refresh matches when screen is focused
    const interval = setInterval(() => {
      setMatches(getMatches());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (matches.length === 0) {
    return (
      <LinearGradient
        colors={['#FF6B35', '#F7931E', '#FFB347']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Matches</Text>
          <Text style={styles.subtitle}>Books you liked will collect here.</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No matches yet</Text>
            <Text style={styles.emptySubtext}>Swipe right on books to add them here!</Text>
          </View>
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
      <View style={styles.container}>
        <Text style={styles.title}>Matches</Text>
        <Text style={styles.subtitle}>Books you liked will collect here.</Text>

        <FlatList
          data={matches}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 32, gap: 12 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.thumbnail && (
                <Image 
                  source={{ uri: item.thumbnail }} 
                  style={styles.bookImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.cardContent}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Match</Text>
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardAuthor}>by {item.authors.join(', ')}</Text>
                {item.categories && item.categories.length > 0 && (
                  <Text style={styles.cardVibe}>{item.categories.slice(0, 2).join(' • ')}</Text>
                )}
              </View>
            </View>
          )}
        />
      </View>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#94A3B8',
    fontSize: 16,
    textAlign: 'center',
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94A3B8',
    marginTop: 6,
    fontSize: 15,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  cardTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardAuthor: {
    color: '#64748B',
    marginTop: 4,
    fontSize: 14,
  },
  cardVibe: {
    color: '#94A3B8',
    marginTop: 6,
    fontSize: 12,
  },
});

