import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Mask, Rect } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withRepeat, withTiming, Easing, interpolate } from 'react-native-reanimated';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const { width, height } = Dimensions.get('window');

export const AnimatedBeam = ({
  pathColor = "rgba(128, 128, 128, 0.2)",
  pathWidth = 2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  duration = 3000, // Increased duration for smoother animation
  delay = 0,
  startX = 50,
  startY = height / 2,
  endX = width - 50,
  endY = height / 2,
  curvature = 0,
  reverse = false,
}) => {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration, easing: Easing.linear, delay }),
      -1,
      false
    );
  }, [duration, delay]);

  const pathD = `M ${startX},${startY} Q ${(startX + endX) / 2},${startY - curvature} ${endX},${endY}`;

  const animatedProps = useAnimatedProps(() => ({
    x: interpolate(progress.value, [0, 1], [startX - 60, endX + 60]), // Increased range for smoother looping
  }));

  const animatedGradientProps = useAnimatedProps(() => ({
    x1: `${interpolate(progress.value, [0, 1], reverse ? [120, -20] : [-20, 120])}%`, // Adjusted for smoother transition
    x2: `${interpolate(progress.value, [0, 1], reverse ? [140, 0] : [0, 140])}%`, // Adjusted for smoother transition
  }));

  return (
    <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}>
      <Svg width={width} height={height}>
        <Defs>
          <AnimatedLinearGradient
            id="beamGradient"
            gradientUnits="userSpaceOnUse"
            animatedProps={animatedGradientProps}
          >
            <Stop offset="0" stopColor={gradientStartColor} stopOpacity="0" />
            <Stop offset="0.1" stopColor={gradientStartColor} stopOpacity="1" /> // Adjusted for smoother fade-in
            <Stop offset="0.9" stopColor={gradientStopColor} stopOpacity="1" /> // Adjusted for smoother fade-out
            <Stop offset="1" stopColor={gradientStopColor} stopOpacity="0" />
          </AnimatedLinearGradient>
          <Mask id="beamMask">
            <AnimatedRect
              x={startX}
              y={startY - pathWidth / 2}
              width={80} // Increased width for longer beam
              height={pathWidth}
              fill="white"
              animatedProps={animatedProps}
            />
          </Mask>
        </Defs>
        <Path
          d={pathD}
          stroke={pathColor}
          strokeWidth={pathWidth}
          fill="none"
        />
        <Path
          d={pathD}
          strokeWidth={pathWidth}
          stroke="url(#beamGradient)"
          fill="none"
          mask="url(#beamMask)"
        />
      </Svg>
    </View>
  );
};
