import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  const onContinue = () => {
    router.replace('/home');
  };

  return (
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
        We’ll text a one-time code. Standard messaging rates apply.
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  hero: {
    gap: 12,
    marginBottom: 28,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34,211,238,0.15)',
    color: '#22D3EE',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#0B1224',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 12,
  },
  label: {
    color: '#E2E8F0',
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
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  prefix: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 16,
  },
  button: {
    marginTop: 6,
    backgroundColor: '#22D3EE',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0B1224',
    fontSize: 16,
    fontWeight: '800',
  },
  disclaimer: {
    color: '#64748B',
    marginTop: 16,
    fontSize: 13,
    lineHeight: 18,
  },
});

