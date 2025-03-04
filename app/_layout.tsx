import { ThemeProvider } from "@/context/themeContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="movieDetails" options={{ headerShown: false }} />
        <Stack.Screen name="favorites" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
