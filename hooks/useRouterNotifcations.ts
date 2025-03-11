import { useRouter } from "expo-router";
import React from "react";
import * as Notifications from "expo-notifications";

export function useRouterNotifications() {
  const router = useRouter();

  React.useEffect(() => {
    let isMounted = true;

    function processUrl(url) {
      // In case you need to modify the URL to make it relative.
      return url;
    }
    Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received in foreground:", notification);
      // Additional handling can be implemented here if needed
    });
    // Handle URL from expo push notifications
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted) {
        return;
      }
      const data = response?.notification.request.content.data;
      if (data?.tool) {
        router.push({
          pathname: data?.url,
          params: {
            tool: data.tool,
            toolsOutput: JSON.stringify(data.toolsOutput),
          },
        });
      }
    });

    // Listen to expo push notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response?.notification.request.content.data;
        const url = response.notification.request.content.data.url;
        if (data?.tool) {
          router.push({
            pathname: url,
            params: {
              tool: data.tool,
              toolsOutput: JSON.stringify(data.toolsOutput),
            },
          });
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}
