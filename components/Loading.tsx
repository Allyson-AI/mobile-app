import React from "react";
import { ActivityIndicator, View, Image, StyleSheet } from "react-native";
import GradientLogo from "~/components/svgs/gradientLogo";
import { useColorScheme } from "~/lib/useColorScheme";
import { Text } from "./ui/typography";

const Loading = () => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/bg.png")}
        style={styles.backgroundImage}
      />
  
      <View style={styles.contentContainer}>
        <GradientLogo />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDarkColorScheme ? "#fbfdfe" : "#020303"}/>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
  },
});

export default Loading;