import * as Notifications from 'expo-notifications';
import { Button, View } from 'react-native';

// 1. Setup the handler so notifications show even when app is in foreground
Notifications.setNotificationHandler({
  handleNotification:  () => ({
    // shouldShowAlert: true,
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  } as any),
});


 export const triggerNotification = async () => {
  await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification",
        body: "Hey Rahul! Your booking is confirmed. Service partner will reach you shortly",
        data: { data: 'goes here',
          screen:"booking-success"
         },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
      },
      // null means trigger immediately
      // trigger: { seconds: 2 }, // use this to test background behavior (tap button then background app)
    });
  };
