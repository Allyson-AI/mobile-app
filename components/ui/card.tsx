import * as React from "react";
import { Text, View, Animated, Pressable } from "react-native";
import { TextClassContext } from "~/components/ui/typography";
import { cn } from "~/lib/utils";
import { LinearGradient } from "expo-linear-gradient";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn(
      "rounded-lg border border-border bg-card shadow-sm shadow-foreground/10",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const GradientCard = React.forwardRef(
  ({ className, colors, start, end, ...props }, ref) => (
    <View
      ref={ref}
      className={cn(
        "rounded-lg border-2 border-border/60 shadow-sm shadow-foreground/10 overflow-hidden bg-background",
        className
      )}
      {...props}
    >
      <LinearGradient
        colors={
          colors || [
            "rgba(61, 169, 204, 0.9)",
            "rgba(69, 194, 236, 0.6)",
            "rgba(173, 93, 200, 0.5)",
            "rgba(173, 93, 200, 0.23)",
          ]
        }
        start={start || { x: 0, y: 0 }}
        end={end || { x: 1, y: 0 }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          borderRadius: 8,
        }}
      />
      {props.children}
    </View>
  )
);
GradientCard.displayName = "GradientCard";

const AnimatedCard = React.forwardRef(({ className, onPress, ...props }, ref) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        ref={ref}
        style={{
          transform: [{ scale: scaleAnim }],
        }}
        className={cn(
          "rounded-lg border border-border bg-card shadow-sm shadow-foreground/10",
          className
        )}
        {...props}
      />
    </Pressable>
  );
});
AnimatedCard.displayName = "AnimatedCard";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <Text
    role="heading"
    aria-level={3}
    ref={ref}
    className={cn(
      "text-2xl text-card-foreground font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <TextClassContext.Provider value="text-card-foreground">
    <View ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  </TextClassContext.Provider>
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn("flex flex-row items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  AnimatedCard,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  GradientCard, // Add this line to export GradientCard
};
