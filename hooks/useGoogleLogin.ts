import React from "react";
import * as WebBrowser from "expo-web-browser";
import { useOAuth, useAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "./useWarmUpBrowser";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

const useGoogleLogin = () => {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  // Move the use of useAuth to the top level of the hook.
  const { userId, getToken } = useAuth();

  const handleLogin = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive, authSessionResult } =
        await startOAuthFlow();
      // Use userId directly from the top-level hook call.
      if (
        createdSessionId &&
        signIn.userData.firstName &&
        signIn.userData.firstName
      ) {
        router.push("/(auth)/(drawer)/home");
      }
      if (createdSessionId && signUp.firstName && signUp.firstName) {
        router.push("/(auth)/(drawer)/home");
      }
      if (createdSessionId && !signUp.firstName && !signUp.firstName) {
        router.push("/(auth)/(onboarding)/name");
      }
      await setActive({ session: createdSessionId }).then(async () => {
        if (createdSessionId && userId) {
          const token = await getToken();
          // Perform the POST request here, using userId.
          await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/login`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName: signUp?.firstName,
              lastName: signUp?.lastName,
              email: signUp?.emailAddress,
            }),
          })
        } 
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please Try Again.",
      });
      console.log( "google oauth error: ", error)
      console.error("OAuth error", error);
    }
  }, [userId, startOAuthFlow]);

  return handleLogin;
};

export default useGoogleLogin;
