import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { useAuth } from '../context/AuthContext';
import { useGoogleAuth } from '../utils/auth';
import type { User } from '../context/AuthContext';

export function LoginScreen() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { request, promptAsync, fetchUserInfo } = useGoogleAuth();

  const handleGoogleSignIn = async () => {
    if (!request) {
      Alert.alert(
        'Configuration needed',
        'Google OAuth client IDs are not configured yet.\n\nSet EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID, EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS, and EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB in your environment.',
      );
      return;
    }
    setIsLoading(true);
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        const token =
          (result as AuthSession.AuthSessionResult & { authentication?: { accessToken?: string } })
            .authentication?.accessToken ??
          result.params?.access_token;
        if (!token) throw new Error('No access token returned');
        const googleUser = await fetchUserInfo(token);
        const user: User = {
          id: googleUser.sub,
          name: googleUser.name,
          email: googleUser.email,
          photoUrl: googleUser.picture,
          provider: 'google',
        };
        await signIn(user, token);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      Alert.alert('Sign-in failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>✨</Text>
        <Text style={styles.title}>Aura</Text>
        <Text style={styles.subtitle}>Your intelligent personal assistant</Text>
      </View>

      <View style={styles.features}>
        <FeatureRow icon="📅" text="Syncs with your calendar" />
        <FeatureRow icon="✅" text="Manages tasks (Microsoft To Do &amp; Todoist)" />
        <FeatureRow icon="🔔" text="Reminds you before it's too late" />
      </View>

      <View style={styles.actions}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#6C63FF" />
        ) : (
          <>
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              accessibilityLabel="Sign in with Google"
            >
              <Text style={styles.googleButtonText}>🔵  Sign in with Google</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.appleButton}
                onPress={() =>
                  Alert.alert(
                    'Apple Sign-In',
                    'Apple Sign-In requires the expo-apple-authentication package and a paid Apple Developer account.\n\nSee README for setup instructions.',
                  )
                }
                accessibilityLabel="Sign in with Apple"
              >
                <Text style={styles.appleButtonText}> Sign in with Apple</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <Text style={styles.legal}>
        By signing in you agree to our Terms of Service and Privacy Policy.
      </Text>
    </View>
  );
}

function FeatureRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FF',
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingVertical: 64,
  },
  hero: { alignItems: 'center', marginTop: 24 },
  logo: { fontSize: 72 },
  title: { fontSize: 40, fontWeight: 'bold', color: '#6C63FF', marginTop: 8 },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8, textAlign: 'center' },
  features: { gap: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: { fontSize: 24 },
  featureText: { fontSize: 16, color: '#333', flexShrink: 1 },
  actions: { gap: 16, alignItems: 'stretch' },
  googleButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  googleButtonText: { fontSize: 16, fontWeight: '600', color: '#333' },
  appleButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  appleButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  legal: { fontSize: 12, color: '#999', textAlign: 'center' },
});
