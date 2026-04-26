import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

interface IntegrationItem {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  description: string;
}

const INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    icon: '📅',
    connected: false,
    description: 'Sync events and deadlines',
  },
  {
    id: 'microsoft-todo',
    name: 'Microsoft To Do',
    icon: '✅',
    connected: false,
    description: 'Import and manage tasks',
  },
  {
    id: 'todoist',
    name: 'Todoist',
    icon: '🔴',
    connected: false,
    description: 'Import and manage tasks',
  },
];

export function SettingsScreen() {
  const { user, signOut } = useAuth();

  const handleConnect = (integration: IntegrationItem) => {
    Alert.alert(
      `Connect ${integration.name}`,
      `OAuth integration with ${integration.name} will be available once the backend service is configured.\n\nSee README for the planned service architecture.`,
    );
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile */}
      <View style={styles.profileCard}>
        {user?.photoUrl ? (
          <Image source={{ uri: user.photoUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{user?.name?.[0] ?? '?'}</Text>
          </View>
        )}
        <View>
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <Text style={styles.profileProvider}>Signed in via {user?.provider}</Text>
        </View>
      </View>

      {/* Integrations */}
      <Text style={styles.sectionTitle}>Integrations</Text>
      {INTEGRATIONS.map(item => (
        <View key={item.id} style={styles.integrationCard}>
          <Text style={styles.integrationIcon}>{item.icon}</Text>
          <View style={styles.integrationBody}>
            <Text style={styles.integrationName}>{item.name}</Text>
            <Text style={styles.integrationDesc}>{item.description}</Text>
          </View>
          <TouchableOpacity
            style={[styles.connectBtn, item.connected && styles.connectBtnConnected]}
            onPress={() => handleConnect(item)}
            accessibilityLabel={`Connect ${item.name}`}
          >
            <Text style={[styles.connectBtnText, item.connected && styles.connectBtnTextConnected]}>
              {item.connected ? 'Connected' : 'Connect'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Sign out */}
      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} accessibilityLabel="Sign out">
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7FF' },
  content: { padding: 20, paddingBottom: 48 },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  profileName: { fontSize: 18, fontWeight: '700', color: '#1A1A2E' },
  profileEmail: { fontSize: 14, color: '#666', marginTop: 2 },
  profileProvider: { fontSize: 12, color: '#999', marginTop: 2, textTransform: 'capitalize' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#333', marginBottom: 12 },
  integrationCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  integrationIcon: { fontSize: 26 },
  integrationBody: { flex: 1 },
  integrationName: { fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  integrationDesc: { fontSize: 13, color: '#888', marginTop: 2 },
  connectBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  connectBtnConnected: { backgroundColor: '#E8F5E9' },
  connectBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  connectBtnTextConnected: { color: '#388E3C' },
  signOutBtn: {
    marginTop: 32,
    backgroundColor: '#FFEBEE',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  signOutText: { color: '#E53935', fontWeight: '700', fontSize: 16 },
});
