import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";

const duration = 1000;

function Skeleton({ style, ...props }) {
  // Initialize the Animated.Value to 0.5 for the starting opacity
  const opacity = useRef(new Animated.Value(0.5)).current;
  const { isDarkColorScheme } = useColorScheme();
  const styles = {
    skeleton: {
      borderRadius: 4,
      backgroundColor: isDarkColorScheme ? "#71717a" : "#d4d4d8",
      // Ensure the initial static style matches the initial animated value
      opacity: 0.5,
    },
  };
  useEffect(() => {
    // Animated.sequence to pulse between 0.5 and 0.2 opacity
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.2,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop(); // Clean up animation on component unmount
  }, [opacity]);

  // Ensure initial style includes the starting opacity to prevent "pop"
  const combinedStyle = [
    styles.skeleton, // Default skeleton styles
    { opacity: opacity }, // Animated opacity
    style, // Custom style passed as prop
  ];

  return <Animated.View style={combinedStyle} {...props} />;
}

export { Skeleton };
