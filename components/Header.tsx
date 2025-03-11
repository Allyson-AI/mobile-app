import { TouchableOpacity, View } from "react-native";
import { Bell, BellDot } from "~/components/Icons";
import * as Haptics from "expo-haptics";
import { H1 } from "./ui/typography";
import { useColorScheme } from "~/lib/useColorScheme";
import { useNavigation, usePathname } from "expo-router";
import { IconMenu2 } from "@tabler/icons-react-native";
import Superwall, {
  PaywallPresentationHandler,
} from "@superwall/react-native-superwall";
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Header({ user, text = "", notificationSheetRef }) {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  const navigation = useNavigation();
  const path = usePathname();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top}}>
      <View className="px-2 w-full pb-2">
        {/* Left-aligned elements */}
        <View className="flex flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.toggleDrawer();
            }}
            className="p-2" // Add padding for larger touch target
          >
            <IconMenu2
              color="#a1a1aa"
              style={{ opacity: 0.8 }}
              size={width > 768 ? 32 : 24} // Increase size for larger screens
            />
          </TouchableOpacity>
          <H1>{text}</H1>
          {/* Right-aligned elements container */}
          <View className="flex flex-row items-center gap-3">

            {/* {path === "/" ? (
              <Card className=" p-3 ">
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    const newTheme = isDarkColorScheme ? "light" : "dark";
                    setColorScheme(newTheme);
                    setAndroidNavigationBar(newTheme);
                    AsyncStorage.setItem("theme", newTheme);
                  }}
                >
                  {isDarkColorScheme ? (
                    <MoonStar
                      color={isDarkColorScheme ? "#fbfdfe" : "#020303"}
                      style={{ opacity: 0.8 }}
                    />
                  ) : (
                    <Sun
                      color={isDarkColorScheme ? "#fbfdfe" : "#020303"}
                      style={{ opacity: 0.8 }}
                    />
                  )}
                </TouchableOpacity>
              </Card>
            ) : null} */}
          </View>
        </View>
      </View>
    </View>
  );
}
