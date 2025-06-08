// app/auth/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack
      initialRouteName="login"            // ← start here, not index
      screenOptions={{ headerShown: false }}
    >
      {/* no need to list index if you never want to show it */}
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
