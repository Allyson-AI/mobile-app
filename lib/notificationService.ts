import * as Notifications from 'expo-notifications';
import { navigate } from './navigationService';

export const setupNotificationListeners = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  // Listener for notifications received while the app is foregrounded
  Notifications.addNotificationReceivedListener((notification) => {
    console.log("Notification received in foreground:", notification);
    // Additional handling can be implemented here if needed
  });

  Notifications.addNotificationResponseReceivedListener((response) => {
    console.log("Notification response received:", response);
    const data = response.notification.request.content.data;
    
  });
};
