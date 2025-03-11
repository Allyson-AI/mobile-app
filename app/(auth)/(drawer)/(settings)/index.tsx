import React, { useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import { LogOut, ChevronRight, Trash } from "~/components/Icons";
import { router, useNavigation } from "expo-router";
import { useColorScheme } from "~/lib/useColorScheme";
import { Text } from "~/components/ui/typography";
import Grid from "~/components/svgs/grid";
import { Card } from "~/components/ui/card";
import {
  IconBell,
  IconLock,
  IconFileDescription,
  IconUserMinus,
  IconStar,
  IconMenu2,
  IconDashboard,
  IconBook,
} from "@tabler/icons-react-native";
import * as StoreReview from "expo-store-review";
import { useUser } from "~/context/UserContext";
import NotificationsDialog from "~/components/dialogs/notifications";
import DeleteAccountDialog from "~/components/dialogs/delete-account";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const navigation = useNavigation();

  const { sessionId, signOut } = useAuth();
  const { user, refreshUser } = useUser();
  const { isDarkColorScheme } = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setIsLoading(true); // Set loading to true when refreshing
    refreshUser().then(() => {
      setRefreshing(false);
      setIsLoading(false); // Set loading to false when refresh is complete
    });
  }, [refreshUser]);

  return (
    <SafeAreaView className="flex-1 justify-center">
      <View className="flex-1 justify-center">
        <Grid
          color={isDarkColorScheme ? "#fff" : "#000"}
          style={{ position: "absolute", zIndex: -1, opacity: 0.5 }} // Example style to position the dot pattern
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          className={`mb-10`}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          scrollEnabled={!isLoading} // Disable scrolling when loading
        >
          <View className="gap-4 px-4">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.toggleDrawer();
                }}
                className="w-10 h-10 mt-3"
              >
                <IconMenu2 size={24} color="#e4e4e7" />
              </TouchableOpacity>
              <Text className="text-2xl text-zinc-200 font-semibold">
                Settings
              </Text>
            </View>

            <Card className="p-4 border border-zinc-800">
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setIsNotificationsModalOpen(true);
                }}
                className="w-full flex flex-row items-center justify-between"
                disabled={isLoading}
              >
                <View className="flex flex-row items-center gap-2">
                  <IconBell size={24} color="#e4e4e7" />
                  <Text className="font-medium text-zinc-200 text-lg">
                    Notifications
                  </Text>
                </View>
                <ChevronRight color="#52525b" />
              </TouchableOpacity>
            </Card>
            <Card className="p-4 border border-zinc-800">
              <TouchableOpacity
                onPress={async () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  await StoreReview.requestReview();
                }}
                className="w-full flex flex-row items-center justify-between"
                disabled={isLoading}
              >
                <View className="flex flex-row items-center gap-2">
                  <IconStar size={24} color="#e4e4e7" />
                  <Text className="font-semibold text-zinc-200 text-lg">
                    Leave a Review
                  </Text>
                </View>
                <ChevronRight color="#52525b" />
              </TouchableOpacity>
            </Card>
            <Card className="p-4 border border-zinc-800">
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  WebBrowser.openBrowserAsync("https://allyson.ai");
                }}
                className="w-full flex flex-row items-center justify-between"
                disabled={isLoading}
              >
                <View className="flex flex-row items-center gap-2">
                  <IconDashboard size={24} color="#e4e4e7" />
                  <Text className="font-medium text-zinc-200 text-lg">
                    Open Dashboard
                  </Text>
                </View>
                <ChevronRight color="#52525b" />
              </TouchableOpacity>
            </Card>
            <Card className="p-4 border border-zinc-800">
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  WebBrowser.openBrowserAsync("https://docs.allyson.ai");
                }}
                className="w-full flex flex-row items-center justify-between"
                disabled={isLoading}
              >
                <View className="flex flex-row items-center gap-2">
                  <IconBook size={24} color="#e4e4e7" />
                  <Text className="font-medium text-zinc-200 text-lg">
                    Documentation
                  </Text>
                </View>
                <ChevronRight color="#52525b" />
              </TouchableOpacity>
            </Card>
            <Card className="p-4 border border-zinc-800">
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  WebBrowser.openBrowserAsync("https://allyson.ai/privacy");
                }}
                className="w-full flex flex-row items-center justify-between"
                disabled={isLoading}
              >
                <View className="flex flex-row items-center gap-2">
                  <IconLock size={24} color="#e4e4e7" />
                  <Text className="font-semibold text-zinc-200 text-lg">
                    Privacy Policy
                  </Text>
                </View>
                <ChevronRight color="#52525b" />
              </TouchableOpacity>
            </Card>

            <Card className="p-4 border border-zinc-800">
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  WebBrowser.openBrowserAsync("https://allyson.ai/terms");
                }}
                className="w-full flex flex-row items-center justify-between"
                disabled={isLoading}
              >
                <View className="flex flex-row items-center gap-2">
                  <IconFileDescription size={24} color="#e4e4e7" />
                  <Text className="font-semibold text-zinc-200 text-lg">
                    Terms & Conditions
                  </Text>
                </View>
                <ChevronRight color="#52525b" />
              </TouchableOpacity>
            </Card>
            <Card className="p-4 border border-zinc-800">
              <TouchableOpacity
                onPress={async () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  await signOut({ sessionId: sessionId });
                  router.push("/(guest)/sign-in");
                }}
                className="w-full flex flex-row items-center justify-between"
                disabled={isLoading}
              >
                <View className="flex flex-row items-center gap-2">
                  <LogOut size={24} color="#e4e4e7" />
                  <Text className="font-semibold text-zinc-200 text-lg">
                    Sign Out
                  </Text>
                </View>
                <ChevronRight color="#52525b" />
              </TouchableOpacity>
            </Card>
            <Card className="p-4 border border-[#401211]">
              <TouchableOpacity
                onPress={async () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setIsDeleteAccountModalOpen(true);
                }}
                className="w-full flex flex-row items-center justify-between"
                disabled={isLoading}
              >
                <View className="flex flex-row items-center gap-2">
                  <IconUserMinus size={24} color="#c53d3a" />
                  <Text className="font-semibold text-[#c53d3a] text-lg">
                    Delete Account
                  </Text>
                </View>
                <Trash color="#c53d3a" />
              </TouchableOpacity>
            </Card>
          </View>
        </ScrollView>
        <Text className="text-zinc-600 text-center font-semibold absolute bottom-0 left-0 right-0">
          Version 2.0.6
        </Text>
        <NotificationsDialog
          isModalOpen={isNotificationsModalOpen}
          setIsModalOpen={setIsNotificationsModalOpen}
        />
        <DeleteAccountDialog
          isModalOpen={isDeleteAccountModalOpen}
          setIsModalOpen={setIsDeleteAccountModalOpen}
        />
      </View>
    </SafeAreaView>
  );
}
