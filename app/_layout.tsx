import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { AppProvider } from '@/contexts/AppContext';
import '../global.css';
function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { isDark } = useTheme();

  useEffect(() => {
    if (isLoading) return;

    const segment = segments[0] as string;
    const inAuthGroup = segment === '(auth)';
    const isSplash = segment === 'splash';

    if (!isAuthenticated && !inAuthGroup && !isSplash) {
      // Redirect to login if not authenticated
      router.replace('/splash' as any);
    } else if (isAuthenticated && (inAuthGroup || isSplash)) {
      // Redirect to home if authenticated
      router.replace('/(tabs)' as any);
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: isDark ? '#111827' : '#FFFFFF' },
        }}>
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="category/[slug]"
          options={{
            presentation: 'card',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="category/[id]"
          options={{
            presentation: 'card',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="booking"
          options={{
            presentation: 'card',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="booking-success"
          options={{
            presentation: 'card',
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
