import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const matches = [
  { id: 'm1', title: 'Project Hail Mary', author: 'Andy Weir', vibe: 'Sci-Fi • Wholesome' },
  { id: 'm2', title: 'Book Lovers', author: 'Emily Henry', vibe: 'Rom-Com • Banter' },
  { id: 'm3', title: 'Lessons in Chemistry', author: 'Bonnie Garmus', vibe: 'Historical • Smart' },
  { id: 'm4', title: 'Fourth Wing', author: 'Rebecca Yarros', vibe: 'Fantasy • Dragons' },
];

export default function MatchesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matches</Text>
      <Text style={styles.subtitle}>Books you liked will collect here.</Text>

      <FlatList
        data={matches}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 32, gap: 12 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>New match</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardAuthor}>{item.author}</Text>
            <Text style={styles.cardVibe}>{item.vibe}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingTop: 48,
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
    backgroundColor: '#0B1224',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34,211,238,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 10,
  },
  badgeText: {
    color: '#22D3EE',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  cardAuthor: {
    color: '#CBD5E1',
    marginTop: 4,
  },
  cardVibe: {
    color: '#94A3B8',
    marginTop: 6,
  },
});

