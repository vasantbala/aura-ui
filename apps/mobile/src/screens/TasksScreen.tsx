import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { scheduleLocalNotification } from '../hooks/usePushNotifications';

interface Task {
  id: string;
  title: string;
  source: 'microsoft-todo' | 'todoist' | 'aura';
  done: boolean;
  dueDate?: string;
}

const SAMPLE_TASKS: Task[] = [
  { id: '1', title: 'Pay electricity bill', source: 'microsoft-todo', done: false, dueDate: 'Apr 30' },
  { id: '2', title: 'Cancel trial subscription', source: 'todoist', done: false, dueDate: 'May 1' },
  { id: '3', title: 'Submit tax documents', source: 'microsoft-todo', done: false, dueDate: 'May 15' },
  { id: '4', title: 'Book dentist appointment', source: 'aura', done: true, dueDate: 'Apr 20' },
];

const SOURCE_LABEL: Record<Task['source'], string> = {
  'microsoft-todo': '📋 Microsoft To Do',
  todoist: '🔴 Todoist',
  aura: '✨ Aura',
};

export function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const remindMe = async (task: Task) => {
    await scheduleLocalNotification(
      `Reminder: ${task.title}`,
      task.dueDate ? `Due ${task.dueDate}` : 'Don\'t forget!',
      10,
    );
    Alert.alert('Reminder set', `You'll be reminded about "${task.title}" in 10 seconds.`);
  };

  const pending = tasks.filter(t => !t.done);
  const completed = tasks.filter(t => t.done);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>
        Tasks pulled from your connected services. Tap to complete or set a reminder.
      </Text>

      <Text style={styles.sectionTitle}>Pending ({pending.length})</Text>
      {pending.map(task => (
        <TaskCard key={task.id} task={task} onToggle={toggleTask} onRemind={remindMe} />
      ))}

      {completed.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Completed</Text>
          {completed.map(task => (
            <TaskCard key={task.id} task={task} onToggle={toggleTask} onRemind={remindMe} />
          ))}
        </>
      )}
    </ScrollView>
  );
}

function TaskCard({
  task,
  onToggle,
  onRemind,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onRemind: (task: Task) => void;
}) {
  return (
    <View style={[styles.card, task.done && styles.cardDone]}>
      <TouchableOpacity
        onPress={() => onToggle(task.id)}
        style={styles.checkbox}
        accessibilityLabel={task.done ? 'Mark incomplete' : 'Mark complete'}
      >
        <Text style={styles.checkboxText}>{task.done ? '✅' : '⬜'}</Text>
      </TouchableOpacity>

      <View style={styles.taskBody}>
        <Text style={[styles.taskTitle, task.done && styles.taskTitleDone]}>{task.title}</Text>
        <View style={styles.taskMeta}>
          <Text style={styles.taskSource}>{SOURCE_LABEL[task.source]}</Text>
          {task.dueDate && <Text style={styles.taskDue}> · Due {task.dueDate}</Text>}
        </View>
      </View>

      {!task.done && (
        <TouchableOpacity
          onPress={() => onRemind(task)}
          style={styles.remindBtn}
          accessibilityLabel={`Set reminder for ${task.title}`}
        >
          <Text style={styles.remindBtnText}>🔔</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7FF' },
  content: { padding: 20, paddingBottom: 40 },
  intro: { fontSize: 14, color: '#888', marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#333', marginBottom: 10 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  cardDone: { opacity: 0.6 },
  checkbox: { padding: 4 },
  checkboxText: { fontSize: 22 },
  taskBody: { flex: 1 },
  taskTitle: { fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  taskTitleDone: { textDecorationLine: 'line-through', color: '#999' },
  taskMeta: { flexDirection: 'row', marginTop: 4 },
  taskSource: { fontSize: 12, color: '#888' },
  taskDue: { fontSize: 12, color: '#E57373' },
  remindBtn: { padding: 8 },
  remindBtnText: { fontSize: 20 },
});
