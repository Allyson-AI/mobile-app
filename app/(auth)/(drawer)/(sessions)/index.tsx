import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Pressable,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { router, useNavigation } from "expo-router";
import Grid from "~/components/svgs/grid";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  IconTrash,
  IconWorld,
  IconPlus,
  IconChevronDown,
  IconChevronRight,
  IconMenu2,
  IconFiles,
} from "@tabler/icons-react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { useUser } from "~/context/UserContext";
import { H3, P, Text } from "~/components/ui/typography";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import * as Haptics from "expo-haptics";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Session Card Component
function SessionCard({ session, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCardClick = useCallback(async () => {
    if (!isDeleting) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(`/session?id=${session.sessionId}`);
    }
  }, [session.id, isDeleting]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/v1/sessions/delete-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId: session.sessionId }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete session");
      onDelete(session.id);
    } catch (error) {
      console.error("Error deleting session:", error);
      onDelete(session.id, true);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Pressable onPress={handleCardClick}>
      <Card className={`p-4 mb-4 ${isDeleting ? "opacity-50" : ""}`}>
        <View className="flex-row justify-between items-center">
          <View className="flex flex-col">
            <Text
              numberOfLines={1}
              className="text-zinc-200 font-semibold max-w-[300px]"
            >
              {session.name}
            </Text>
            <View className="flex-row justify-between items-center mt-2">
              <View className="flex-row items-center gap-2">
                <View
                  className={`w-2 h-2 rounded-full ${
                    session.status === "active"
                      ? "bg-green-500"
                      : session.status === "completed"
                      ? "bg-blue-500"
                      : session.status === "failed"
                      ? "bg-red-500"
                      : session.status === "humanInput"
                      ? "bg-yellow-500"
                      : session.status === "inactive"
                      ? "bg-red-500"
                      : "bg-red-500"
                  }`}
                />
                <Text className="text-md text-zinc-400">
                  {session.status === "active"
                    ? "Active"
                    : session.status === "completed"
                    ? "Completed"
                    : session.status === "failed"
                    ? "Failed"
                    : session.status === "humanInput"
                    ? "Help Needed"
                    : "Inactive"}
                </Text>
                {session.files.length > 0 && (
                  <IconFiles size={14} color="#a1a1aa" />
                )}
                <Text className="text-zinc-400">-</Text>
                <Text className="text-md text-zinc-400">
                  {session.cost.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </Text>
              </View>
            </View>
          </View>
          <IconChevronRight size={20} color="#a1a1aa" className="ml-2" />
        </View>
      </Card>
    </Pressable>
  );
}

// Main Browser Component
export default function Sessions() {
  const { isLoaded, userId, getToken } = useAuth();
  const { makeAuthenticatedRequest } = useUser();
  const navigation = useNavigation();
  const [browserSessions, setBrowserSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async (loadMore = false) => {
    if (loadMore) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const token = await getToken();
      const status = statusFilter !== "all" ? statusFilter : "";
      const page = loadMore ? currentPage + 1 : 1;
      const limit = itemsPerPage;
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/v1/sessions?page=${page}&limit=${limit}&status=${status}&source=client`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (loadMore) {
        setBrowserSessions((prev) => [...prev, ...data.sessions]);
        setCurrentPage((prev) => prev + 1);
      } else {
        setBrowserSessions(data.sessions);
        setCurrentPage(1);
      }
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoadingMore(false);
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && currentPage < totalPages) {
      fetchSessions(true);
    }
  };

  const handleDelete = useCallback((deletedSessionId, revert = false) => {
    setBrowserSessions((prevSessions) => {
      if (revert) {
        return prevSessions.some(
          (session) => session && session.id === deletedSessionId
        )
          ? prevSessions
          : [
              ...prevSessions,
              prevSessions.find(
                (session) => session && session.id === deletedSessionId
              ),
            ]
              .filter(Boolean)
              .sort(
                (a, b) =>
                  new Date(b.lastActionDate) - new Date(a.lastActionDate)
              );
      } else {
        return prevSessions.filter(
          (session) => session && session.id !== deletedSessionId
        );
      }
    });

    // if (!revert) {
    //   toast({
    //     title: "Session deleted",
    //     description: "The browser session has been successfully deleted.",
    //   });
    // }
  }, []);
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSessions();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [statusFilter]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <Grid
          color={isDarkColorScheme ? "#fff" : "#000"}
          style={{ position: "absolute", zIndex: -1, opacity: 0.5 }}
        />

        <View className="px-4">
          <View className="flex-row justify-between items-center h-16 mb-4">
            <View className="flex-row">
              <TouchableOpacity
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.toggleDrawer();
                }}
                className="w-10 h-10"
              >
                <IconMenu2 size={24} color="#e4e4e7" />
              </TouchableOpacity>
              <Text className="text-2xl text-zinc-200 font-semibold -mt-0.5">
                Sessions
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <DropdownMenuTrigger className="flex flex-row items-center gap-2 px-3 py-2 rounded-md border border-border">
                  <Text className="text-md text-zinc-200">
                    {statusFilter === "all"
                      ? "All"
                      : statusFilter === "active"
                      ? "Active"
                      : statusFilter === "humanInput"
                      ? "Help Needed"
                      : statusFilter === "completed"
                      ? "Completed"
                      : statusFilter === "failed"
                      ? "Failed"
                      : statusFilter === "stopped"
                      ? "Stopped"
                      : "Inactive"}
                  </Text>
                  <IconChevronDown size={16} color="#e4e4e7" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mt-2">
                  <DropdownMenuItem
                    className="border-b border-border"
                    onPress={async () => {
                      await Haptics.impactAsync(
                        Haptics.ImpactFeedbackStyle.Light
                      );
                      setStatusFilter("all");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Text className="text-zinc-200 text-sm">All</Text>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="border-b border-border"
                    onPress={async () => {
                      await Haptics.impactAsync(
                        Haptics.ImpactFeedbackStyle.Light
                      );
                      setStatusFilter("active");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Text className="text-zinc-200 text-sm">Active</Text>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="border-b border-border"
                    onPress={async () => {
                      await Haptics.impactAsync(
                        Haptics.ImpactFeedbackStyle.Light
                      );
                      setStatusFilter("humanInput");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Text className="text-zinc-200 text-sm">Help Needed</Text>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="border-b border-border"
                    onPress={async () => {
                      await Haptics.impactAsync(
                        Haptics.ImpactFeedbackStyle.Light
                      );
                      setStatusFilter("completed");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Text className="text-zinc-200 text-sm">Completed</Text>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="border-b border-border"
                    onPress={async () => {
                      await Haptics.impactAsync(
                        Haptics.ImpactFeedbackStyle.Light
                      );
                      setStatusFilter("stopped");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Text className="text-zinc-200 text-sm">Stopped</Text>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onPress={async () => {
                      await Haptics.impactAsync(
                        Haptics.ImpactFeedbackStyle.Light
                      );
                      setStatusFilter("failed");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Text className="text-zinc-200 text-sm">Failed</Text>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="icon"
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/(sessions)/session");
                }}
                className="w-10 h-10 items-center justify-center"
              >
                <IconPlus size={20} color="#fff" />
              </Button>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onScroll={({ nativeEvent }) => {
              const { layoutMeasurement, contentOffset, contentSize } =
                nativeEvent;
              const isCloseToBottom =
                layoutMeasurement.height + contentOffset.y >=
                contentSize.height - 20;

              if (isCloseToBottom) {
                handleLoadMore();
              }
            }}
            scrollEventThrottle={400}
          >
            {loading && !refreshing && currentPage === 1 ? (
              <ActivityIndicator size="large" />
            ) : browserSessions.length > 0 ? (
              <>
                {browserSessions.map((session) => (
                  <SessionCard
                    key={session.sessionId}
                    session={session}
                    onDelete={handleDelete}
                    makeAuthenticatedRequest={makeAuthenticatedRequest}
                  />
                ))}
                {isLoadingMore && (
                  <View className="py-4">
                    <ActivityIndicator size="small" />
                  </View>
                )}
              </>
            ) : (
              <Card className="items-center justify-center p-4 py-6">
                <IconWorld size={40} color="#666" />

                {statusFilter !== "inactive" ? (
                  <>
                    <Text className="text-zinc-500 text-center mt-2">
                      No sessions yet
                    </Text>
                    <Button
                      variant="outline"
                      onPress={async () => {
                        await Haptics.impactAsync(
                          Haptics.ImpactFeedbackStyle.Light
                        );
                        router.push("/(sessions)/session");
                      }}
                      className="mt-4 flex-row items-center justify-center gap-2"
                    >
                      <IconPlus size={18} color="#fff" />
                      <Text className="text-md -mt-0.5">
                        Start a new session
                      </Text>
                    </Button>
                  </>
                ) : (
                  <Text className="text-zinc-500 text-center mt-2">
                    No active sessions yet
                  </Text>
                )}
              </Card>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
