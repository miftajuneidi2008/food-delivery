import { Stack } from "expo-router";

export default function CustomerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="order/[id]"
        options={{
          headerShown: true,
          title: "Menu",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
