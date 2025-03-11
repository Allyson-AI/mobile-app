import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  router,
  useLocalSearchParams,
  useNavigation,
  usePathname,
} from "expo-router";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/typography";
import Messages from "~/components/browser/messages";
import {
  IconChevronLeft,
  IconSettings,
  IconFiles,
  IconPlayerStop,
  IconX,
  IconMaximize,
  IconArrowUp,
  IconMenu2,
} from "@tabler/icons-react-native";
import { useAuth } from "@clerk/clerk-expo";
import { Skeleton } from "~/components/ui/skeleton";
import * as Haptics from "expo-haptics";
import { DynamicTextInput } from "~/components/ui/input";
import SettingsDialog from "~/components/browser/settings-dialog";
import FilesDialog from "~/components/browser/files-dialog";
import Toast from "react-native-toast-message";
import { useUser } from "~/context/UserContext";
import Grid from "../svgs/grid";
import { useColorScheme } from "~/lib/useColorScheme";
import Superwall, {
  PaywallPresentationHandler,
} from "@superwall/react-native-superwall";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from 'expo-navigation-bar';

export default function SessionComponent() {
  const { id } = useLocalSearchParams();
  const { refreshUser } = useUser();
  const pathname = usePathname();
  const navigation = useNavigation();
  const [sessionId, setSessionId] = useState(null || id);
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionStatus, setSessionStatus] = useState("inactive");
  const [lastScreenshotUrl, setLastScreenshotUrl] = useState(null);
  const [message, setMessage] = useState("");
  const { getToken } = useAuth();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFilesOpen, setIsFilesOpen] = useState(false);
  const [responseQuality, setResponseQuality] = useState("noResponse");
  if (Platform.OS === "android") {
    NavigationBar.setBackgroundColorAsync("black");
  }
  const fetchSession = useCallback(
    async (showLoading = false) => {
      if (showLoading) setLoading(true);
      try {
        const token = await getToken();
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/v1/sessions/${sessionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setSessionStatus(data.session?.status);
        setMessages(data.session?.messages || []);
        setLastScreenshotUrl(data.session?.lastScreenshotUrl);
        setFiles(data.session?.files || []);
        setResponseQuality(data.session?.responseQuality || "noResponse");
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [sessionId, id]
  );

  const handleSendMessageUpdate = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/v1/sessions/${sessionId}/send-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: message,
          }),
        }
      );
      await response.json();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Message sent successfully.",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to send message. Please try again.",
      });
    } finally {
      setMessage("");
    }
  };

  async function handleSend() {
    if (!message) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a message.",
      });
      return;
    }
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/v1/sessions/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            task: message,
            sessionSettings: {},
          }),
        }
      );

      const data = await response.json();
      if (!data.sessionId) {
        if (data.error === "Reload your balance.") {
          const handler = new PaywallPresentationHandler();
          handler.onPresent = (paywallInfo) => {
            const name = paywallInfo.name;
          };
          Superwall.shared
            .register("test", undefined, handler)
            .then(() => {
              refreshUser();
            })
            .catch((error) => {
              console.error("Error presenting paywall:", error);
              // Log more details about the error
              if (error instanceof Error) {
                console.error("Error name:", error.name);
                console.error("Error message:", error.message);
                console.error("Error stack:", error.stack);
              }
            });
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Failed to start task. Please try again.",
          });
        }
      } else {
        setSessionId(data.sessionId);
        router.push(`/(sessions)/session?id=${data.sessionId}`);
      }
    } catch (error) {
      console.error("Error starting session:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Failed to start session`,
      });
    } finally {
      setMessage("");
    }
  }

  const handleStop = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const token = await getToken();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/v1/sessions/${sessionId}/stop`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSessionStatus("stopped");
      router.push("/(sessions)");
    } catch (error) {
      console.error("Error stopping session:", error);
    }
  };

  async function updateResponseQuality(quality) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setResponseQuality(quality);
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/v1/sessions/${sessionId}/update-response-quality`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            responseQuality: quality,
          }),
        }
      );
      await response.json();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Response quality updated successfully",
      });
    } catch (error) {
      console.error("Error updating message:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update response quality. Please try again.",
      });
    }
  }

  useEffect(() => {
    if (sessionId || id) {
      fetchSession();
      setSessionId(id);
    }
  }, [sessionId, id, fetchSession]);

  useEffect(() => {
    let interval;

    if (sessionStatus === "active" || sessionStatus === "humanInput") {
      interval = setInterval(() => {
        fetchSession(false);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [sessionStatus, fetchSession]);

  const LoadingView = () => (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="light" />
      <View className="flex-1">
        {/* Header Skeleton */}
        <View className="flex-row justify-between items-center p-4 border-b border-border">
          <Button
            variant="outline"
            size="icon"
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSessionId(null);
              setSessionStatus("inactive");
              setMessages([]);
              setLastScreenshotUrl(null);
              setFiles([]);
              router.back("/(sessions)");
            }}
            className="w-10 h-10"
          >
            <IconChevronLeft size={24} color="#a1a1aa" className="" />
          </Button>
          <View className="flex-row items-center gap-2">
            <Skeleton className="w-24 h-6 rounded-lg" />
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-10 h-10 rounded-lg" />
          </View>
        </View>

        {/* Screenshot Area Skeleton */}
        <View className="h-1/3">
          <Skeleton className="h-full m-4 rounded-lg" />
        </View>

        {/* Messages Skeleton */}
        <View className="flex-1 p-4 gap-4">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </View>
      </View>
    </SafeAreaView>
  );

  const FullScreenImage = () => (
    <View className="pb-4 relative">
      <TouchableOpacity
        className="absolute right-4 top-4 z-10"
        onPress={() => setIsFullScreen(false)}
      >
        <IconX size={24} color="#fff" />
      </TouchableOpacity>
      <Image
        source={{ uri: lastScreenshotUrl }}
        className="w-full h-full"
        resizeMode="contain"
        style={{ transform: [{ rotate: "90deg" }] }}
      />
    </View>
  );
  const { isDarkColorScheme } = useColorScheme();
  if (loading) {
    return <LoadingView />;
  }
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="light" />
      <Grid
        color={isDarkColorScheme ? "#fff" : "#000"}
        style={{ position: "absolute", zIndex: -1, opacity: 0.5 }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 8}
        style={{ flex: 1 }}
      >
        {isFullScreen && <FullScreenImage />}
        {!isFullScreen && (
          <View className="flex-1">
            {/* Header Controls - Always shown */}
            {/* Header Controls */}
            {!isFullScreen && (
              <View className="flex-row justify-between items-center px-4 pb-4 border-b border-border">
                {pathname === "/home" ? (
                  <TouchableOpacity
                    onPress={async () => {
                      await Haptics.impactAsync(
                        Haptics.ImpactFeedbackStyle.Light
                      );
                      navigation.toggleDrawer();
                    }}
                    className="w-10 h-10"
                  >
                    <IconMenu2 size={24} color="#e4e4e7" />
                  </TouchableOpacity>
                ) : (
                  <Button
                    variant="outline"
                    size="icon"
                    onPress={async () => {
                      await Haptics.impactAsync(
                        Haptics.ImpactFeedbackStyle.Light
                      );
                      setSessionId(null);
                      setSessionStatus("inactive");
                      setMessages([]);
                      setLastScreenshotUrl(null);
                      setFiles([]);
                      router.replace("/(sessions)");
                    }}
                    className="w-10 h-10"
                  >
                    <IconChevronLeft size={24} color="#a1a1aa" />
                  </Button>
                )}

                <View className="flex-row items-center gap-2">
                  <View className="flex-row items-center gap-2">
                    <View
                      className={`w-2 h-2 rounded-full ${
                        sessionStatus === "active"
                          ? "bg-green-500"
                          : sessionStatus === "humanInput"
                          ? "bg-yellow-500"
                          : sessionStatus === "completed"
                          ? "bg-blue-500"
                          : sessionStatus === "failed"
                          ? "bg-red-500"
                          : sessionStatus === "inactive"
                          ? "bg-red-500"
                          : sessionStatus === "stopped"
                          ? "bg-red-500"
                          : "bg-red-500"
                      }`}
                    />
                    <Text className="text-sm text-zinc-400">
                      {sessionStatus === "active"
                        ? "Active"
                        : sessionStatus === "humanInput"
                        ? "Help Needed"
                        : sessionStatus === "completed"
                        ? "Completed"
                        : sessionStatus === "failed"
                        ? "Failed"
                        : sessionStatus === "stopped"
                        ? "Stopped"
                        : "Inactive"}
                    </Text>
                  </View>

                  {sessionStatus === "active" ||
                    (sessionStatus === "humanInput" && (
                      <Button
                        variant="outline"
                        size="icon"
                        onPress={handleStop}
                        className="w-10 h-10"
                      >
                        <IconPlayerStop size={24} color="#ef4444" />
                      </Button>
                    ))}

                  {files.length > 0 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onPress={async () => {
                        await Haptics.impactAsync(
                          Haptics.ImpactFeedbackStyle.Light
                        );
                        setIsFilesOpen(true);
                      }}
                      className="w-10 h-10"
                    >
                      <IconFiles size={24} color="#e4e4e7" />
                    </Button>
                  )}
                  {/* {sessionStatus !== "completed" && (
                  <Button
                    variant="outline"
                    size="icon"
                    onPress={async () => {
                      await Haptics.impactAsync(
                        Haptics.ImpactFeedbackStyle.Light
                      );
                      setIsSettingsOpen(true);
                    }}
                    className="w-10 h-10"
                  >
                      <IconSettings size={24} color="#e4e4e7" />
                    </Button>
                  )} */}
                </View>
              </View>
            )}

            {/* Main Content Area */}
            {!sessionId ? (
              <View className="flex-1">
                <Card className="h-1/3 items-center justify-center m-4 mb-8">
                  <Text className="text-zinc-400">
                    {sessionStatus === "active"
                      ? "Please wait for browser to load..."
                      : "Ask me to start a task for you."}
                  </Text>
                </Card>
                {/* Messages and Input Section */}
                <View className="flex-1">
                  <View className="flex-1" style={{ marginBottom: -4 }}>
                    <Messages
                      messages={messages}
                      files={files}
                      sessionId={sessionId}
                      updateResponseQuality={updateResponseQuality}
                      responseQuality={responseQuality}
                    />
                  </View>
                  {sessionStatus !== "completed" &&
                    sessionStatus !== "failed" && (
                      <View
                        style={{ paddingBottom: Platform.OS === "ios" ? 2 : 0 }}
                      >
                        <View className="flex-row items-center px-2">
                          <View className="flex-1">
                            <DynamicTextInput
                              value={message}
                              onChangeText={setMessage}
                            />
                          </View>
                          {message.trim() !== "" && (
                            <TouchableOpacity
                              onPress={() => {
                                Haptics.impactAsync(
                                  Haptics.ImpactFeedbackStyle.Medium
                                );
                                sessionId
                                  ? handleSendMessageUpdate()
                                  : handleSend();
                              }}
                              className="p-2 bg-zinc-300 rounded-full ml-2"
                            >
                              <IconArrowUp color="#3f3f46" size={20} />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    )}
                </View>
              </View>
            ) : (
              <View className="flex-1">
                {/* Screenshot/Browser View */}
                {!isFullScreen && lastScreenshotUrl ? (
                  <View className="h-1/3 pb-4 relative">
                    <Image
                      source={{ uri: lastScreenshotUrl }}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setIsFullScreen(true);
                      }}
                      className="absolute bottom-6 right-4 bg-black/50 rounded-full p-2"
                    >
                      <IconMaximize size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Card className="h-1/3 items-center justify-center m-4 mb-8">
                    <Text className="text-zinc-400">
                      {sessionStatus === "active"
                        ? "Please wait for browser to load..."
                        : "Ask me to start a task for you."}
                    </Text>
                  </Card>
                )}

                {/* Messages and Input Section */}
                <View className="flex-1">
                  <View className="flex-1" style={{ marginBottom: -4 }}>
                    <Messages
                      messages={messages}
                      files={files}
                      sessionId={sessionId}
                      updateResponseQuality={updateResponseQuality}
                      responseQuality={responseQuality}
                    />
                  </View>
                  {sessionStatus !== "completed" &&
                    sessionStatus !== "failed" && (
                      <View
                        style={{ paddingBottom: Platform.OS === "ios" ? 2 : 0 }}
                      >
                        <View className="flex-row items-center px-2">
                          <View className="flex-1">
                            <DynamicTextInput
                              value={message}
                              onChangeText={setMessage}
                            />
                          </View>
                          {message.trim() !== "" && (
                            <TouchableOpacity
                              onPress={() => {
                                Haptics.impactAsync(
                                  Haptics.ImpactFeedbackStyle.Medium
                                );
                                sessionId
                                  ? handleSendMessageUpdate()
                                  : handleSend();
                              }}
                              className="p-2 bg-zinc-300 rounded-full ml-2"
                            >
                              <IconArrowUp color="#3f3f46" size={20} />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    )}
                </View>
              </View>
            )}
          </View>
        )}
      </KeyboardAvoidingView>
      <SettingsDialog isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />
      <FilesDialog
        files={files}
        isOpen={isFilesOpen}
        setIsOpen={setIsFilesOpen}
      />
    </SafeAreaView>
  );
}
