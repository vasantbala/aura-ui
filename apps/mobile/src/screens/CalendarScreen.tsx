import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: 'bill' | 'renewal' | 'appointment' | 'subscription';
}

const SAMPLE_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Electricity Bill Due', date: 'Apr 30, 2026', time: 'All day', category: 'bill' },
  { id: '2', title: 'Passport Renewal Eligible', date: 'May 12, 2026', time: 'All day', category: 'renewal' },
  { id: '3', title: 'Doctor Appointment', date: 'May 5, 2026', time: '10:30 AM', category: 'appointment' },
  { id: '4', title: 'Adobe CC Subscription Renews', date: 'May 8, 2026', time: 'All day', category: 'subscription' },
  { id: '5', title: 'Water Bill Due', date: 'May 15, 2026', time: 'All day', category: 'bill' },
];

const CATEGORY_COLOR: Record<CalendarEvent['category'], string> = {
  bill: '#EF9A9A',
  renewal: '#CE93D8',
  appointment: '#80DEEA',
  subscription: '#FFE082',
};

const CATEGORY_ICON: Record<CalendarEvent['category'], string> = {
  bill: '💳',
  renewal: '🛂',
  appointment: '🏥',
  subscription: '🔄',
};

export function CalendarScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>
        Upcoming events Aura is tracking. Connect your calendar in Settings.
      </Text>

      {SAMPLE_EVENTS.map(event => (
        <View key={event.id} style={[styles.card, { borderLeftColor: CATEGORY_COLOR[event.category] }]}>
          <Text style={styles.cardIcon}>{CATEGORY_ICON[event.category]}</Text>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{event.title}</Text>
            <Text style={styles.cardDate}>
              {event.date} · {event.time}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: CATEGORY_COLOR[event.category] }]}>
            <Text style={styles.badgeText}>{event.category}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7FF' },
  content: { padding: 20, paddingBottom: 40 },
  intro: { fontSize: 14, color: '#888', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  cardIcon: { fontSize: 28 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  cardDate: { fontSize: 13, color: '#888', marginTop: 3 },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#fff', textTransform: 'capitalize' },
});
