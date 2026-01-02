import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <LinearGradient
      colors={['#FF6B35', '#F7931E', '#FFB347']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}>
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
            <Text style={styles.buttonTextPrimary}>Log out</Text>
          </Pressable>
        </View>
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
  card: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  label: {
    color: '#64748B',
    fontSize: 13,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  value: {
    color: '#0F172A',
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
    borderColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonPrimary: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  buttonTextPrimary: {
    color: '#FF6B35',
    fontWeight: '800',
    fontSize: 16,
  },
});
