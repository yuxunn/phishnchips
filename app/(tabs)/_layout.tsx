import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }: { color: string }) => <MaterialIcons name="book" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="detect"
        options={{
          title: 'Detect',
          tabBarIcon: ({ color }: { color: string }) => <MaterialIcons name="search" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ color }: { color: string }) => <MaterialIcons name="report" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="forum"
        options={{
          title: 'Forum',
          tabBarIcon: ({ color }: { color: string }) => <MaterialIcons name="forum" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }: { color: string }) => <MaterialIcons name="account-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="post/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="post/createpost"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="learn/part"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="learn/badges"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="learn/lesson"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}