import * as React from "react";
import { Platform } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import * as ProgressPrimitive from "~/components/primitives/progress";
import { cn } from "~/lib/utils";
const Progress = React.forwardRef(({ className, value, ...props }, ref) => {
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-zinc-800",
        className
      )}
      {...props}
    >
      <Indicator value={value} />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;
export { Progress };
function Indicator({ value }) {
  const progress = useDerivedValue(() => value ?? 0);
  const indicator = useAnimatedStyle(() => {
    return {
      width: withSpring(
        `${interpolate(
          progress.value,
          [0, 100],
          [1, 100],
          Extrapolation.CLAMP
        )}%`,
        { overshootClamping: true }
      ),
    };
  });
  if (Platform.OS === "web") {
    return (
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary web:transition-all"
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    );
  }
  return (
    <ProgressPrimitive.Indicator asChild>
      <Animated.View style={indicator} className={cn("h-full bg-zinc-500")} />
    </ProgressPrimitive.Indicator>
  );
}
