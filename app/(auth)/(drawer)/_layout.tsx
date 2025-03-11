import { Drawer } from "expo-router/drawer";
import Superwall, {
  PaywallPresentationHandler,
  SuperwallOptions,
} from "@superwall/react-native-superwall";
import { useEffect, useRef, useState } from "react";
import { Linking, Platform, View, Text } from "react-native";
import { RCPurchaseController } from "~/lib/RCPurchaseController";
import { MySuperwallDelegate } from "~/lib/MySuperwallDelegate";
import { IconPlus, IconSettings, IconWorld } from "@tabler/icons-react-native";
import { useUser } from "~/context/UserContext";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "~/components/ui/card";
import { TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { Skeleton } from "~/components/ui/skeleton";
import { useRouter } from "expo-router";

const CustomDrawerContent = ({ user, isLoading, reload, ...props }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Bottom Card */}
      <View style={{ paddingBottom: insets.bottom, paddingHorizontal: 16 }}>
        <Card className="p-4 border border-zinc-800">
          <TouchableOpacity
            className="w-full"
            onPress={() => {
              if (!isLoading) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                reload();
              }
            }}
            disabled={isLoading}
          >
            <View className="flex flex-row justify-between items-center">
              <Text className="text-lg font-medium text-zinc-400">Balance</Text>
              {isLoading ? (
                <Skeleton className="w-20 h-6" />
              ) : (
                <Text className="text-md text-zinc-400 font-semibold ">
                  {user?.plan === "Business" ? "Business" : "Pay As You Go"}
                </Text>
              )}
            </View>

            <View className="flex flex-row justify-between">
              {isLoading ? (
                <Skeleton className="w-20 h-6" />
              ) : (
                <Text className="text-md mt-2 text-zinc-500">
                  {user?.balance > 0 ? user?.balance.toLocaleString("en-US", {
                    style: "currency",
                        currency: "USD",
                      })
                    : "$0.00"}
                </Text>
              )}

              <Text className="text-md mt-2 text-zinc-500">Tap to reload</Text>
            </View>
          </TouchableOpacity>
        </Card>
      </View>
    </View>
  );
};

export default function AuthenticatedLayout() {
  const isSuperwallSetup = useRef(false);
  const delegate = new MySuperwallDelegate();
  const { user, refreshUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const setupSuperwall = async () => {
      const apiKey =
        Platform.OS === "ios"
          ? process.env.SUPERWALL_IOS_API_KEY
          : process.env.SUPERWALL_ANDROID_API_KEY;

      const purchaseController = new RCPurchaseController(user?.userId);
      const options = new SuperwallOptions();
      options.isExternalDataCollectionEnabled = false;

      Superwall.configure(apiKey, options, purchaseController);
      Superwall.shared.setDelegate(delegate);
      purchaseController.syncSubscriptionStatus();
      isSuperwallSetup.current = true;
    };

    setupSuperwall();

    Linking.getInitialURL().then((url) => {
      if (url) {
        Superwall.shared.handleDeepLink(url);
      }
    });

    const linkingListener = Linking.addEventListener("url", (event) => {
      Superwall.shared.handleDeepLink(event.url);
    });

    return () => {
      linkingListener.remove();
    };
  }, [delegate, user?.userId]);

  const reload = () => {
    const handler = new PaywallPresentationHandler();
    handler.onPresent = (paywallInfo) => {
      const name = paywallInfo.name;
    };
    Superwall.shared
      .register("test", undefined, handler)
      .then(() => {
        refreshUser();
      })
      .catch((error) => {
        console.error("Error presenting paywall:", error);
        // Log more details about the error
        if (error instanceof Error) {
          console.error("Error name:", error.name);
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
      });
  };

  return (
    <Drawer
      initialRouteName="(drawer)"
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => (
        <CustomDrawerContent reload={reload} user={user} {...props} />
      )}
    >
      <Drawer.Screen
        name="home"
        options={{
          drawerIcon: () => <IconPlus size={24} color="#fff" />,
          drawerLabel: "New Session",
          drawerActiveBackgroundColor: "#000",
          drawerItemStyle: {
            borderColor: "#27272a",
            borderWidth: 1,
          },
          headerShown: false,
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/(sessions)/session");
          },
        }}
      />
      <Drawer.Screen
        name="(sessions)"
        options={{
          drawerIcon: () => <IconWorld size={24} color="#fff" />,
          drawerLabel: "Sessions",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="(settings)"
        options={{
          drawerIcon: () => <IconSettings size={24} color="#fff" />,
          drawerLabel: "Settings",
          headerShown: false,
        }}
      />
    </Drawer>
  );
}
