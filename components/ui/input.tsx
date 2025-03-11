import * as React from "react";
import { 
  TextInput, 
  View, 
  Animated,
  Platform,
} from "react-native";
import { cn } from "~/lib/utils";
import { useState, useRef } from "react";
import * as Haptics from "expo-haptics";

// Regular Input component with keyboard awareness
const Input = React.forwardRef(
  ({ className, placeholderClassName, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "web:flex h-10 native:h-12 web:w-full rounded-md border border-input bg-background px-2  text-sm native:text-lg text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          props.editable === false && "opacity-50 web:cursor-not-allowed",
          className
        )}
        placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

// Dynamic Text Input with enhanced keyboard handling
const DynamicTextInput = React.forwardRef(({ value, onChangeText }, ref) => {
  const [inputHeight, setInputHeight] = useState(32);
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const lineHeight = 16;
  const maxLines = 6;
  const maxHeight = lineHeight * maxLines;

  const expandAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  const handleContentSizeChange = (event) => {
    const { height } = event.nativeEvent.contentSize;
    setInputHeight(Math.min(maxHeight, Math.max(32, height)));
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.parallel([
      Animated.timing(expandAnimation, {
        toValue: isExpanded ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
      ...slideAnimations.map((anim, index) =>
        Animated.timing(anim, {
          toValue: isExpanded ? 0 : 1,
          duration: 200,
          delay: isExpanded ? 0 : index * 50,
          useNativeDriver: true,
        })
      ),
    ]).start();
  };

  const handleTextChange = (text) => {
    if (isExpanded) {
      setIsExpanded(false);
      toggleExpand();
    }
    onChangeText(text);
  };

  return (
    <View
      className="bg-background flex-row items-center"
      style={{
        minHeight: 64,
        maxHeight: maxHeight,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#27272a",
        overflow: "hidden",
        marginBottom: 0,
      }}
    >
      <Animated.View style={{ flex: 1 }}>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={handleTextChange}
          multiline
          onContentSizeChange={handleContentSizeChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onTouchStart={() => {
            if (isExpanded) {
              setIsExpanded(false);
              toggleExpand();
            }
          }}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 6,
            fontSize: 16,
            lineHeight: lineHeight,
            minHeight: 32,
            maxHeight: maxHeight,
            color: '#e4e4e7',
          }}
          cursorColor="#a1a1aa"
          placeholder={isFocused ? "" : "Type a message..."}
          placeholderTextColor="#a1a1aa"
          textAlignVertical="top"
        />
      </Animated.View>
    </View>
  );
});

DynamicTextInput.displayName = "DynamicTextInput";

export { Input, DynamicTextInput };
  