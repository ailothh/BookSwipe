import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  const onContinue = () => {
    router.replace('/home');
  };

  return (
    <LinearGradient
      colors={['#FF6B35', '#F7931E', '#FFB347']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.hero}>
        <Text style={styles.badge}>BookSwipe</Text>
        <Text style={styles.title}>Sign in with your phone</Text>
        <Text style={styles.subtitle}>
          Keep your stacks, likes, and matches synced across devices.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Phone number</Text>
        <View style={styles.inputRow}>
          <Text style={styles.prefix}>+1</Text>
          <TextInput
            style={styles.input}
            placeholder="555 123 4567"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <Pressable style={styles.button} onPress={onContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>

      <Text style={styles.disclaimer}>
        We'll text a one-time code. Standard messaging rates apply.
      </Text>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  hero: {
    gap: 12,
    marginBottom: 28,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  label: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  prefix: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    color: '#0F172A',
    fontSize: 16,
  },
  button: {
    marginTop: 6,
    backgroundColor: '#FF6B35',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  disclaimer: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 16,
    fontSize: 13,
    lineHeight: 18,
  },
});

