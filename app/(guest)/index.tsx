import { Redirect } from "expo-router";

export default function Root() {
  return <Redirect href='/(guest)/sign-in' />;
}

