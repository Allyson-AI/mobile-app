import React, { useState, useEffect } from "react";
import { View, Pressable } from "react-native";
import { Dialog, DialogContent, DialogHeader } from "~/components/ui/dialog";
import { Text } from "~/components/ui/typography";
import { useAuth } from "@clerk/clerk-expo";
import { IconTrash, IconX } from "@tabler/icons-react-native";
import { Button } from "../ui/button";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import { useUser } from "~/context/UserContext";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export default function DeleteAccountDialog({ isModalOpen, setIsModalOpen }) {
  const { user } = useUser();
  const { userId, sessionId, getToken, signOut } = useAuth();
  const router = useRouter();
  async function deleteAccount() {
    try {
      const token = await getToken();

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/user/delete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
      signOut({ sessionId: sessionId });
      router.push("/(guest)/sign-in");
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please Try Again.",
      });
    }
  }

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
            Are you sure?
          </Text>
          <Text className="text-md text-center text-zinc-400">
            Once you delete your account you will lose access to your account
            and all your information will be deleted.
          </Text>
        </DialogHeader>
        <Button
          variant="outline"
          className="w-full flex-row items-center justify-center gap-2 mt-4 border border-[#401211] "
          onPress={deleteAccount}
        >
          <IconTrash size={20} color="#c53d3a" />
          <Text className="text-sm text-[#c53d3a]">Delete Account</Text>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
