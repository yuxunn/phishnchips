// app/_layout.tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import {
  ThemeProvider,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../auth-context';  

export default function RootLayout() {
  const scheme = useColorScheme() ?? 'light';
  const navigationTheme =
    scheme === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme;

  return (
    <ThemeProvider value={navigationTheme}>
      <PaperProvider theme={navigationTheme}>
        <AuthProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <Stack initialRouteName="auth" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="auth" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
            </Stack>
          </SafeAreaView>
        </AuthProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}