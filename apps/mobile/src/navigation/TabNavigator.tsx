import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export type TabParamList = {
  Home: undefined;
  Tasks: undefined;
  Calendar: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICON: Record<string, { focused: string; default: string }> = {
  Home: { focused: 'home', default: 'home-outline' },
  Tasks: { focused: 'checkbox', default: 'checkbox-outline' },
  Calendar: { focused: 'calendar', default: 'calendar-outline' },
  Settings: { focused: 'settings', default: 'settings-outline' },
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICON[route.name];
          const iconName = focused ? icons.focused : icons.default;
          return <Ionicons name={iconName as never} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#9E9E9E',
        headerStyle: { backgroundColor: '#6C63FF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Aura' }} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
