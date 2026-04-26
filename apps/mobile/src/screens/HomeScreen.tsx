import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { useAuth } from '../context/AuthContext';

const REMINDER_EXAMPLES = [
  { id: '1', icon: '🛂', title: 'Passport Renewal', detail: 'Eligible for renewal in 3 months' },
  { id: '2', icon: '💳', title: 'Credit Card Bill', detail: 'Due in 5 days — $124.50' },
  { id: '3', icon: '🔔', title: 'Subscription Renewal', detail: 'Netflix renews in 2 days' },
  { id: '4', icon: '📋', title: 'Annual Review', detail: 'Scheduled for next Monday' },
];

export function HomeScreen() {
  const { user } = useAuth();
  const { expoPushToken } = usePushNotifications();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>
          Hello, {user?.name?.split(' ')[0] ?? 'there'} 👋
        </Text>
        <Text style={styles.greetingSubtext}>Here's what needs your attention today.</Text>
      </View>

      <Text style={styles.sectionTitle}>Upcoming Reminders</Text>

      {REMINDER_EXAMPLES.map(item => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.cardIcon}>{item.icon}</Text>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDetail}>{item.detail}</Text>
          </View>
        </View>
      ))}

      {expoPushToken && (
        <View style={styles.tokenBadge}>
          <Text style={styles.tokenLabel}>Push notifications active ✅</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7FF' },
  content: { padding: 20, paddingBottom: 40 },
  greeting: { marginBottom: 24 },
  greetingText: { fontSize: 26, fontWeight: 'bold', color: '#1A1A2E' },
  greetingSubtext: { fontSize: 15, color: '#666', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    gap: 14,
  },
  cardIcon: { fontSize: 32 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A2E' },
  cardDetail: { fontSize: 14, color: '#888', marginTop: 2 },
  tokenBadge: {
    marginTop: 24,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  tokenLabel: { color: '#388E3C', fontWeight: '600' },
});
