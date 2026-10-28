import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { UserRole } from "@food-delivery/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "../global.css";

const queryClient = new QueryClient();
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  const homeHref =
    user?.role === UserRole.CUSTOMER
      ? "/(customer)/(home)"
      : user?.role === UserRole.RESTAURANT_OWNER
        ? "/(owner)/(index)"
        : user?.role === UserRole.DRIVER
          ? "/(driver)"
          : "/login";

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!user} redirectTo={homeHref}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack.Protected>

      <Stack.Protected
        guard={user?.role === UserRole.CUSTOMER}
        redirectTo="/login"
      >
        <Stack.Screen name="(customer)" />
      </Stack.Protected>

      <Stack.Protected
        guard={user?.role === UserRole.RESTAURANT_OWNER}
        redirectTo="/login"
      >
        <Stack.Screen name="(owner)" />
      </Stack.Protected>

      <Stack.Protected
        guard={user?.role === UserRole.DRIVER}
        redirectTo="/login"
      >
        <Stack.Screen name="(driver)" />
      </Stack.Protected>

      <Stack.Protected guard={__DEV__} redirectTo="/login">
        <Stack.Screen name="health" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AnimatedSplashOverlay />
        <RootNavigator />
      </AuthProvider>
    </QueryClientProvider>
  );
}
