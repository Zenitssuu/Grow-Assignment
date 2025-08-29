import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { ThemeProvider, ThemeContext } from "@/theme/ThemeContext";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";
import BiometricAuth from "@/components/custom/BiometricAuth";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [queryClient] = useState(() => new QueryClient());
  const [authenticated, setAuthenticated] = useState(false);

  if (!loaded) {
    return null;
  }

  // if (!authenticated) {
  //   return <BiometricAuth onSuccess={() => setAuthenticated(true)} />;
  // }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ThemeContext.Consumer>
              {({ theme }) => (
                <NavigationThemeProvider
                  value={theme === "dark" ? DarkTheme : DefaultTheme}
                >
                  <Stack>
                    <Stack.Screen
                      name="(tabs)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="StockDetails"
                      options={{
                        headerShown: false,
                      }}
                    />
                    <Stack.Screen
                      name="TopStocksScreen"
                      options={({
                        route,
                      }: {
                        route: { params?: { title?: string } };
                      }) => ({
                        title: route.params?.title || "Top Gainers",
                        headerShown: false,
                      })}
                    />
                    <Stack.Screen
                      name="ProfileScreen"
                      options={() => ({
                        title: "User Profile",
                      })}
                    />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                  <StatusBar style={theme === "dark" ? "light" : "dark"} />
                </NavigationThemeProvider>
              )}
            </ThemeContext.Consumer>
          </ThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
