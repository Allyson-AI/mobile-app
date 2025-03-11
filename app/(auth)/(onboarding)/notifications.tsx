import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as Haptics from "expo-haptics";
import { H3, P } from "~/components/ui/typography";
import GradientButton from "~/components/GradientButton";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { IconBell } from "@tabler/icons-react-native";
import * as Notifications from "expo-notifications";
import { useUser } from "~/context/UserContext";
import { useAuth } from "@clerk/clerk-expo";

export default function NotificationsScreen() {
  const [permissionStatus, setPermissionStatus] = useState(null);
  const { user } = useUser();
  const { isLoaded, userId, getToken } = useAuth();

  useEffect(() => {
    checkNotificationPermissions();
  }, []);

  const checkNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus(status);
  };

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionStatus(status);
    return status;
  };

  const getExpoPushToken = async () => {
    const { data: token } = await Notifications.getExpoPushTokenAsync();
    return token;
  };

  const updateNotificationSettings = async (token, pushToken) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/user/update-notifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: userId,
            email: user.notificationSettings.email,
            mobile: true,
            expoPushToken: pushToken,
          }),
        }
      );

      const data = await response.json();
      console.log("Notification settings updated:", data);
    } catch (error) {
      console.error("Error updating notification settings:", error);
    }
  };

  const handleContinue = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const token = await getToken();

    if (permissionStatus !== "granted") {
      const status = await requestNotificationPermissions();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "To receive notifications, please enable them in your device settings.",
          [{ text: "OK" }]
        );
        return;
      }
    }
    
    const pushToken = await getExpoPushToken();
    await updateNotificationSettings(token, pushToken);
    
    // Proceed to the next screen
    router.push("/(auth)/(onboarding)/review");
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(auth)/(onboarding)/review");
  };
  if (user && user.expoPushToken && user.notificationSettings.mobile) {
    router.push("/(auth)/(onboarding)/review");
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1">
        <Image
          source={require("../../../assets/bg.png")}
          className="absolute w-full h-full"
          resizeMode="cover"
        />
        <View className="flex-1 justify-between items-center px-8 pb-8">
          <View className="flex-1 justify-center items-center">
            <View className="items-center">
              <View className="w-24 h-24 rounded-full bg-white/20 items-center justify-center mb-6">
                <IconBell size={40} color="#fff" />
              </View>
              <H3 className="text-center font-bold mb-2 text-zinc-200">
                Enable Notifications
              </H3>

              <P className="text-center mb-8 text-zinc-400">
                Allyson works in the background so enable notifications to get
                the latest updates when she needs you.
              </P>
            </View>
          </View>

          <View className="w-full">
            <GradientButton
              text={
                permissionStatus === "granted"
                  ? "Continue"
                  : "Enable Notifications"
              }
              onPress={handleContinue}
              className="w-full mb-4"
            />
            <TouchableOpacity onPress={handleSkip} className="mt-2 mb-3">
              <Text className="text-center text-zinc-300/30">Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
