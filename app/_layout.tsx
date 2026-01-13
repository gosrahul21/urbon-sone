import { Stack, useRouter, useSegments } from "expo-router";
// import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { AppProvider } from "@/contexts/AppContext";
import "../global.css";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, StatusBar } from "react-native";
import * as Notifications from 'expo-notifications'

import { makeRedirectUri } from "expo-auth-session";


function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { isDark } = useTheme();

// ... inside your component
const redirectUri = makeRedirectUri({
    // useProxy: true
});

console.log("Here is your redirect URI:", redirectUri);

  useEffect(() => {
    if (isLoading) return;

    const segment = segments[0] as string;
    const inAuthGroup = segment === "(auth)";
    const isSplash = segment === "splash";

    if (!isAuthenticated && !inAuthGroup && !isSplash) {
      // Redirect to login if not authenticated
      router.replace("/splash" as any);
    } 
    // else if (isAuthenticated && (inAuthGroup || isSplash)) {
    //   // Redirect to home if authenticated
    //   router.replace("/(tabs)" as any);
    // }
  }, [isAuthenticated, isLoading, segments, router]);

  // 1. Listen for the User Tapping the Notification
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      
      // Extract data from the notification payload
      const data = response.notification.request.content.data;
      const targetScreen = data?.screen; 

      // Navigate if a screen is provided
      if (targetScreen) {
        console.log(`Navigating to ${targetScreen}`);
        // Use the ref to navigate
        // if (navigationRef.isReady()) {
        //     navigationRef.navigate(targetScreen);

        // }
        router.replace(targetScreen as any)
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: isDark ? "#111827" : "#FFFFFF" },
        }}
      >
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="category/[slug]"
          options={{
            presentation: "card",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="category/[id]"
          options={{
            presentation: "card",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="booking"
          options={{
            presentation: "card",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="booking-success"
          options={{
            presentation: "card",
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
    </SafeAreaProvider>
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
