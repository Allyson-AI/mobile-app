import React, { useState, useMemo, useCallback } from "react";
import {
  Dimensions,
  Platform,
  View,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StatusBar,
  Linking,
} from "react-native";
import { StyleSheet } from "react-native";
import Google from "~/components/svgs/google";
import Apple from "~/components/svgs/apple";
import useGoogleLogin from "~/hooks/useGoogleLogin";
import useAppleLogin from "~/hooks/useAppleLogin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { useAuth, useSignIn, useSignUp } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export default function Onboarding() {
  const { width, height } = Dimensions.get("window");
  const iconSize = Math.min(width * 0.8, height * 0.4); // Adjust these values as needed
  const { userId, getToken } = useAuth();
  const {
    isLoaded: isSignUpLoaded,
    signUp,
    setActive: setSignUpActive,
  } = useSignUp();
  const {
    isLoaded: isSignInLoaded,
    signIn,
    setActive: setSignInActive,
  } = useSignIn();
  const [verifying, setVerifying] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // If user is signed in, don't render the form
  if (userId) {
    return null;
  }
  async function createAccount(token) {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/user/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isSignUpLoaded || !signUp || !isSignInLoaded || !signIn) return null;
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      // First try to create a new account
      try {
        const signUpAttempt = await signUp.create({
          emailAddress: email,
        });
        // Prepare email verification
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        setVerifying(true);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Verification code sent to your email!",
        });
      } catch (err) {
        // If email exists, try to sign in instead
        if (err.errors?.[0]?.code === "form_identifier_exists") {
          const signInAttempt = await signIn.create({
            identifier: email,
          });

          // Get the emailAddressId from the first factor
          const emailAddressId = signInAttempt.supportedFirstFactors.find(
            (factor) => factor.strategy === "email_code"
          )?.emailAddressId;

          if (!emailAddressId) {
            throw new Error("Email verification not supported");
          }

          await signIn.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId,
          });
          setVerifying(true);
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Verification code sent to your email!",
          });
        } else {
          throw err;
        }
      }
    } catch (err) {
      if (err.errors?.[0]) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: err.errors[0].message,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Something went wrong. Please try again.",
        });
      }
      console.error("Error:", JSON.stringify(err, null, 2));
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleVerification(e) {
    e.preventDefault();
    if (!isSignUpLoaded || !signUp || !isSignInLoaded || !signIn) return null;
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      let result;
      let isNewUser = false;

      // Try sign-up verification first
      try {
        result = await signUp.attemptEmailAddressVerification({
          code,
        });
        if (result.status === "complete") {
          await setSignUpActive({ session: result.createdSessionId });
          isNewUser = true;
        }
      } catch (err) {
        // If sign-up verification fails, try sign-in verification
        result = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code,
        });
        if (result.status === "complete") {
          await setSignInActive({ session: result.createdSessionId });
        }
      }

      if (result.status === "complete") {
        try {
          if (isNewUser) {
            const token = await getToken();
            await createAccount(token);
          }
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "You are signed in!",
          });
          router.push("/(auth)/(drawer)/home");
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Account setup incomplete. Please contact support.",
          });
          console.error("Account creation error:", error);
        }
      }
    } catch (err) {
      if (err.errors?.[0]) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: err.errors[0].message,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Invalid verification code. Please try again.",
        });
      }
      console.error("Error:", JSON.stringify(err, null, 2));
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Image
        source={require("../../assets/bg.png")}
        style={styles.backgroundImage}
      />

      <SafeAreaView style={styles.safeArea}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Dialog
            open={true}
            onOpenChange={() => {
              Keyboard.dismiss();
            }}
          >
            <DialogContent>
              <View className="flex flex-col ">
                <Card className="border-0 bg-transparent shadow-none">
                  <CardHeader className="text-center -mt-4">
                    <CardTitle className="text-2xl text-center">
                      {verifying ? "Check Your Email" : "Sign in to Allyson"}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {verifying
                        ? `We've sent a verification code to ${email}`
                        : "Start automating your workflow"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {verifying ? (
                      <View className="flex justify-center">
                        <View className="grid gap-6">
                          <View className="grid gap-2">
                            <Input
                              value={code}
                              onChangeText={(e) => setCode(e)}
                              placeholder="123456"
                              required
                              disabled={isProcessing}
                              maxLength={6}
                              keyboardType="number-pad"
                            />
                          </View>
                          <Button
                            variant="outline"
                            className="w-full"
                            disabled={isProcessing}
                            onPress={handleVerification}
                          >
                            {isProcessing ? (
                              <>
                                <Text className="mr-2 text-zinc-200">
                                  Verifying
                                </Text>
                              </>
                            ) : (
                              <Text className="text-zinc-200">
                                Verify Email
                              </Text>
                            )}
                          </Button>
                        </View>
                      </View>
                    ) : (
                      <View>
                        <View className="grid gap-4">
                          {/* <View className="flex flex-col gap-4">
                            <Button
                              variant="outline"
                              className="w-full flex flex-row items-center justify-center gap-2"
                            >
                              <Apple
                                fill="#e4e4e7"
                                style={{ width: 20, height: 20 }}
                              />
                              <Text className="text-zinc-200 font-semibold">
                                Continue with Apple
                              </Text>
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full flex flex-row items-center justify-center gap-2"
                            >
                              <Google style={{ width: 20, height: 20 }} />
                              <Text className="text-zinc-200 font-semibold">
                                Continue with Google
                              </Text>
                            </Button>
                          </View>
                          <View className=" flex-row items-center justify-center gap-2 grid grid-cols-3">
                            <View className="w-1/4 border-t border-border" />
                            <Text className="text-muted-foreground text-center">
                              Or continue with
                            </Text>
                            <View className="w-1/4 border-t border-border" />
                          </View> */}
                          <View className="grid gap-4">
                            <View className="grid gap-2">
                              <Text className="text-sm font-medium text-zinc-200">
                                Email
                              </Text>
                              <Input
                                id="email"
                                type="email"
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="email"
                                value={email}
                                onChangeText={(e) => setEmail(e)}
                                placeholder="john@allyson.ai"
                                required
                                disabled={isProcessing}
                              />
                            </View>
                            <Button
                              variant="outline"
                              className="w-full"
                              disabled={isProcessing}
                              onPress={handleSubmit}
                            >
                              {isProcessing ? (
                                <Text className="mr-2 text-zinc-200">
                                  Sending Code
                                </Text>
                              ) : (
                                <Text className="text-zinc-200">
                                  Continue with Email
                                </Text>
                              )}
                            </Button>
                          </View>
                        </View>
                      </View>
                    )}
                  </CardContent>
                </Card>
                {!verifying && (
                  <View className="mt-4 text-center  text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                    <Text className="text-center text-xs text-zinc-500">
                      By clicking continue, you agree to our{" "}
                      <Text
                        className="underline text-zinc-500"
                        onPress={() =>
                          Linking.openURL("https://allyson.ai/terms")
                        }
                      >
                        Terms of Service
                      </Text>{" "}
                      and{" "}
                      <Text
                        className="underline text-zinc-500"
                        onPress={() =>
                          Linking.openURL("https://allyson.ai/privacy")
                        }
                      >
                        Privacy Policy
                      </Text>
                      .
                    </Text>
                  </View>
                )}
              </View>
            </DialogContent>
          </Dialog>
        </GestureHandlerRootView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Add a background color to prevent any white flashes
  },
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  iconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  icon: {
    width: "65%",
    height: "65%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 20,
  },
  emailCardContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  emailCard: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 100,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 20 : 20,
  },
});
