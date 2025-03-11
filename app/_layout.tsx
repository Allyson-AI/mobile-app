import "../global.css";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "@react-navigation/native";
import { Slot, SplashScreen, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToastProvider } from "~/components/ui/toast";
import { PortalHost } from "~/components/primitives/portal/portal-native";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "../cache";
import { useEffect } from "react";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRouterNotifications } from "~/hooks/useRouterNotifcations";
import { PostHogProvider, usePostHog } from "posthog-react-native";
import * as Updates from "expo-updates";
import Toast from "react-native-toast-message";
import * as QuickActions from "expo-quick-actions";
import { Platform } from "react-native";
import { GlobalStateProvider } from "~/context/GlobalStateContext";
import { UserProvider } from "~/context/UserContext";
import * as Notifications from "expo-notifications";

async function checkForUpdates() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      Toast.show({
        type: "success",
        text1: "Update Available",
        text2:
          "A new update is ready. Please reload the app to apply the latest features & improvements.",
      });
      Updates.reloadAsync();
    }
  } catch (e) {
    console.error(e);
  }
}

const LIGHT_THEME = {
  dark: true,
  colors: NAV_THEME.dark,
};
const DARK_THEME = {
  dark: true,
  colors: NAV_THEME.dark,
};

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [isCheckingForUpdates, setIsCheckingForUpdates] = useState(false);
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const posthog = usePostHog();
  const path = usePathname();

  useEffect(() => {
    QuickActions.setItems([
      {
        title: "Start Session",
        subtitle: "Start a new session",
        icon: Platform.OS === "ios" ? "symbol:play" : undefined,
        id: "0",
        params: { href: "/(auth)/(drawer)/(sessions)/session" },
      },
      {
        title: "View Sessions",
        subtitle: "View your sessions",
        icon: Platform.OS === "ios" ? "symbol:list.dash" : undefined,
        id: "1",
        params: { href: "/(auth)/(drawer)/(sessions)/" },
      },
    ]);
    (async () => {
      posthog?.capture("Screen View", { screen: path });
      const theme = await AsyncStorage.getItem("theme");
      if (!theme) {
        setAndroidNavigationBar(colorScheme);
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      setAndroidNavigationBar(colorTheme);
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
      setIsCheckingForUpdates(true);
      try {
        await checkForUpdates();
      } catch (error) {
        console.error("Error checking for updates:", error);
        // Optionally show an error toast here
      } finally {
        setIsCheckingForUpdates(false);
      }
    })().finally(() => {
      SplashScreen.hideAsync();
    });
    const subscription = QuickActions.addListener((action) => {
      router.push(action.params.href);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // Handle notification responses when app is running
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        console.log("notification data", data);
        if (data?.sessionId) {
          // Navigate to session page with the ID
          router.push(`/(drawer)/(sessions)/session?id=${data.sessionId}`);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.remove();
    };
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }
  return (
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        <UserProvider>
          <PostHogProvider
            apiKey={process.env.POSTHOG_API_KEY}
            options={{
              host: "https://app.posthog.com",
            }}
          >
            <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
              <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
              <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                  <SafeAreaProvider>
                    <ClerkLoaded>
                      <Slot />
                    </ClerkLoaded>
                  </SafeAreaProvider>
                </BottomSheetModalProvider>
              </GestureHandlerRootView>
              <PortalHost />
              <ToastProvider />
            </ThemeProvider>
          </PostHogProvider>
        </UserProvider>
      </ClerkProvider>
  );
}
