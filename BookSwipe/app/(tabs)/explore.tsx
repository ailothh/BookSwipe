import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const curatedLists = [
  { title: 'Trending This Week', count: '24 books', color: '#22D3EE' },
  { title: 'Critically Acclaimed', count: '12 books', color: '#A855F7' },
  { title: 'Cozy Fantasy Picks', count: '18 books', color: '#F472B6' },
  { title: 'Dark Academia', count: '9 books', color: '#38BDF8' },
];

export default function ExploreScreen() {
  return (
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
            <View key={list.title} style={[styles.card, { borderColor: list.color }]}>
              <Text style={[styles.cardTitle, { color: list.color }]}>{list.title}</Text>
              <Text style={styles.cardCount}>{list.count}</Text>
              <Text style={styles.cardHint}>Tap to open the rail</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
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
  searchBox: {
    marginTop: 20,
    backgroundColor: '#1F2937',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  input: {
    color: '#E2E8F0',
    fontSize: 16,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    color: '#E2E8F0',
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
    backgroundColor: '#0B1224',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  cardCount: {
    color: '#CBD5E1',
    marginTop: 6,
  },
  cardHint: {
    color: '#94A3B8',
    marginTop: 10,
    fontSize: 13,
  },
});
