import React, { useState, useEffect } from "react";
import { View, Platform, Pressable } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Toast from "react-native-toast-message";
import { Dialog, DialogContent, DialogHeader } from "~/components/ui/dialog";
import { Text } from "~/components/ui/typography";
import { Card } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { IconX } from "@tabler/icons-react-native";
import * as Haptics from "expo-haptics";
import { useUser } from "~/context/UserContext";

export default function NotificationsDialog({ isModalOpen, setIsModalOpen }) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [notificationSettings, setNotificationSettings] = useState({});

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Toast.show({
          type: "error",
          text1: "Error",
          text2:
            "Go to Settings > Notifications > Allyson and enable the notifications and then go back to Allyson and toggle the switch for 'Mobile Notifications' in the app settings.",
        });
        return;
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "437dc3c2-90df-46f0-8330-16d9a3a72355",
        })
      ).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  const handleToggleChange = async (settingName, newValue) => {
    // Update local state
    const updatedSettings = {
      ...notificationSettings,
      [settingName]: newValue,
    };
    setNotificationSettings(updatedSettings);

    // If the mobile notifications setting is toggled to true, register for push notifications
    if (settingName === "mobile" && newValue === true) {
      try {
        const expoPushToken = await registerForPushNotificationsAsync();
        // Send updated settings and Expo push token to the backend
        updateNotificationSettingsBackend(
          updatedSettings.mobile,
          updatedSettings.email,
          expoPushToken
        );
      } catch (error) {
        console.error("Error registering for push notifications:", error);
        // Handle any errors, such as reverting the toggle or showing an error message
      }
    } else {
      // For other cases, just send the updated settings without the Expo push token
      updateNotificationSettingsBackend(
        updatedSettings.mobile,
        updatedSettings.email,
        null
      );
    }
  };

  async function updateNotificationSettingsBackend(
    mobile,
    email,
    expoPushToken
  ) {
    const token = await getToken();
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/update-notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mobile: mobile,
        email: email,
        expoPushToken: expoPushToken,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Notification Settings Updated",
        });
      })
      .catch((error) => {
        console.log("update notification settings error: ", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please Try Again.",
        });
      });
  }

  useEffect(() => {
    if (user) {
      setNotificationSettings({
        email: user.notificationSettings?.email,
        mobile: user.notificationSettings?.mobile,
      });
    }
  }, [user]);

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
        <View className=" rounded-xl p-1 mt-10">
          <Card className="w-full rounded-xl p-5 flex flex-row items-center justify-between">
            <View className="flex flex-col">
              <Text className="text-zinc-400 font-bold">
                Mobile Notifications
              </Text>
            </View>
            <Switch
              onCheckedChange={(newValue) =>
                handleToggleChange("mobile", newValue)
              }
              checked={notificationSettings.mobile}
            />
          </Card>
          <Card className="mt-5 p-5 w-full flex flex-row items-center justify-between">
            <View className="flex flex-col">
              <Text className="text-zinc-400 font-bold">
                Email Notifications
              </Text>
            </View>
            <Switch
              onCheckedChange={(newValue) =>
                handleToggleChange("email", newValue)
              }
              checked={notificationSettings.email}
            />
          </Card>
        </View>
      </DialogContent>
    </Dialog>
  );
}
