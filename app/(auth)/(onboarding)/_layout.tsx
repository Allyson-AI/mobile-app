import React, { useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useUser } from "~/context/UserContext";
import Loading from "~/components/Loading";

export default function OnboardingLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user, loading } = useUser();
  
  if (loading) {
    return <Loading />;
  }

  if (user && (!user.fname || !user.lname)) {
    return <Redirect href="/name" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
