import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { cn } from "~/lib/utils";
import { BellDot } from "./Icons";
export function ModalToggle() {
  return (
    <Pressable
      
      className=""
    >
      {({ pressed }) => (
        <View
          className={cn(
            "flex items-center ml-2 flex-row ",
            pressed && "opacity-70"
          )}
        >
          <BellDot className="text-foreground ml-4" size={24} strokeWidth={1.25} />
        </View>
      )}
    </Pressable>
  );
}
