import { Redirect } from "expo-router";
import * as React from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";

export default function RootLayout() {
  return (
    <>
      <SignedIn>
        <Redirect href="/(auth)/(drawer)/home" />
      </SignedIn>
      <SignedOut>
        <Redirect href="/(guest)/sign-in" />
      </SignedOut>
    </>
  );
}
