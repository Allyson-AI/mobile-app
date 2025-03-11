import React, { useState, useEffect } from "react";
import { View, Pressable } from "react-native";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/typography";
import { useAuth } from "@clerk/clerk-expo";
import { IconX } from "@tabler/icons-react-native";
import { Button } from "../ui/button";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import { useUser } from "~/context/UserContext";
import Toast from "react-native-toast-message";

export default function EnableNotificationsDialog({ isModalOpen, setIsModalOpen }) {
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
            email: user?.notificationSettings?.email || false,
            mobile: true,
            expoPushToken: pushToken,
          }),
        }
      );

      const data = await response.json();
      setIsModalOpen(false);
      Toast.show({
        type: "success",
        text1: "Notifications enabled",
        text2: "You will now receive notifications from Allyson.",
      });
    } catch (error) {
      console.error("Error updating notification settings:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          "Go to Settings > Notifications > Allyson and enable the notifications and then go back to Allyson and toggle the switch for 'Mobile Notifications' in the app settings.",
      });
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
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="my-auto">
        <DialogHeader>
          <View className="flex-row justify-end items-end w-full">
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsModalOpen(false);
              }}
            >
              <IconX size={20} color="#a1a1aa" />
            </Pressable>
          </View>
          <Text className="text-xl text-center font-semibold text-zinc-200">
            You need to enable notifications
          </Text>
          <Text className="text-md text-center text-zinc-400">
            Allyson will need your help with tasks and the best way to get ahold
            of you is via notifications. Please enable them to get the most out
            of Allyson.
          </Text>
        </DialogHeader>
        <Button
          variant="outline"
          className="w-full flex-row items-center justify-center gap-2 mt-4"
          onPress={handleContinue}
        >
          <Text className="text-sm text-zinc-400">Enable Notifications</Text>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
