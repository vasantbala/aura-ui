import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

/**
 * Google OAuth 2.0 credentials.
 * Replace these with your own credentials from https://console.cloud.google.com/
 *
 * IMPORTANT: Never commit real credentials. Store them in environment variables or
 * EAS Secrets (https://docs.expo.dev/build-reference/variables/).
 */
const GOOGLE_CLIENT_ID_ANDROID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID ?? '';
const GOOGLE_CLIENT_ID_IOS = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS ?? '';
const GOOGLE_CLIENT_ID_WEB = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB ?? '';

function getGoogleClientId(): string {
  if (Platform.OS === 'android') return GOOGLE_CLIENT_ID_ANDROID;
  if (Platform.OS === 'ios') return GOOGLE_CLIENT_ID_IOS;
  return GOOGLE_CLIENT_ID_WEB;
}

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export interface GoogleUser {
  sub: string;
  name: string;
  email: string;
  picture?: string;
}

export function useGoogleAuth() {
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'aura' });
  const clientId = getGoogleClientId();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
      usePKCE: false,
    },
    discovery,
  );

  const fetchUserInfo = React.useCallback(
    async (accessToken: string): Promise<GoogleUser> => {
      const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!resp.ok) throw new Error('Failed to fetch Google user info');
      return resp.json() as Promise<GoogleUser>;
    },
    [],
  );

  return { request, response, promptAsync, fetchUserInfo };
}

/**
 * Generates a random nonce for Apple Sign-In.
 */
export async function generateNonce(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(32);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
