import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import * as StoreReview from "expo-store-review";
import { H3, P } from "~/components/ui/typography";
import GradientButton from "~/components/GradientButton";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { IconStar } from "@tabler/icons-react-native";

export default function ReviewScreen() {
  const handleReview = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (await StoreReview.hasAction()) {
      try {
        await StoreReview.requestReview();
        // Only navigate after the review process is complete
        router.push("/(auth)/(drawer)/home");
      } catch (error) {
        console.error("Error requesting review:", error);
        // Optionally handle the error, e.g., show an alert to the user
      }
    } else {
      // If StoreReview is not available, you might want to provide an alternative action
      console.log("Store review is not available on this device");
      // Optionally navigate to home or show a message to the user
    }
  };

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
                <IconStar size={40} color="#fff" />
              </View>
              <H3 className="text-center font-bold mb-2 text-zinc-200">
                Leave A Review
              </H3>

              <P className="text-center mb-8 text-zinc-400">
                We value your feedback. Your honest review helps us improve Allyson and serve you better.
              </P>
            </View>
          </View>

          <View className="w-full">
            <GradientButton
              text="Leave a Review"
              onPress={handleReview}
              className="w-full mb-4"
            />
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
