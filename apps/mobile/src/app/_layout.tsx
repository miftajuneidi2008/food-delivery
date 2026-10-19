import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { UserRole } from "@food-delivery/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "../global.css";
const queryClient = new QueryClient();
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  function RootNavigator() {
    const { user, isLoading } = useAuth();

    if (isLoading) return null;

    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="health" />

        <Stack.Protected guard={!user}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack.Protected>

        <Stack.Protected guard={!!user && user.role === UserRole.CUSTOMER}>
          <Stack.Screen name="(customer)" />
        </Stack.Protected>

        <Stack.Protected
          guard={!!user && user.role === UserRole.RESTAURANT_OWNER}
        >
          <Stack.Screen name="(owner)" />
        </Stack.Protected>

        <Stack.Protected guard={!!user && user.role === UserRole.DRIVER}>
          <Stack.Screen name="(driver)" />
        </Stack.Protected>
      </Stack>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AnimatedSplashOverlay />
        <RootNavigator />
      </AuthProvider>
    </QueryClientProvider>
  );
}
