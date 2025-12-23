import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <Text style={styles.subtitle}>Keep your vibes and preferences synced.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>+1 •••• ••••</Text>

        <Text style={[styles.label, { marginTop: 16 }]}>Reading mood</Text>
        <Text style={styles.value}>Cozy & character-driven</Text>

        <Text style={[styles.label, { marginTop: 16 }]}>Weekly goal</Text>
        <Text style={styles.value}>Read 3 chapters</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.buttonSecondary}>
          <Text style={styles.buttonText}>Edit profile</Text>
        </Pressable>
        <Pressable style={styles.buttonPrimary}>
          <Text style={[styles.buttonText, { color: '#0B1224' }]}>Log out</Text>
        </Pressable>
      </View>
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
    marginTop: 20,
    backgroundColor: '#0B1224',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  label: {
    color: '#94A3B8',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  value: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  buttonSecondary: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
  buttonPrimary: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#22D3EE',
  },
  buttonText: {
    color: '#F8FAFC',
    fontWeight: '800',
    fontSize: 16,
  },
});

