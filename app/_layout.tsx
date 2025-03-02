import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "@/redux/store";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const loadSplash = async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      await SplashScreen.hideAsync();
    };

    loadSplash();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colorScheme === "dark" ? "black" : "white",
        }}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/Login" options={{ headerShown: false }} />
          <Stack.Screen
            name="(home-screen)/(spo)/(tabs)/Home"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(services)/(printSlip)/PrintSlip"
            options={{ headerShown: false }}
          />
        </Stack>
      </SafeAreaView>
    </Provider>
  );
}
