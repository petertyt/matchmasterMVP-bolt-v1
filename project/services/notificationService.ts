import { Platform } from 'react-native';

/**
 * Notification service for handling push notifications across platforms
 */
export class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize notification service
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      if (Platform.OS === 'web') {
        // Web push notification setup
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          // Register service worker for push notifications
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered:', registration);
          this.isInitialized = true;
          return true;
        }
      } else {
        // For native platforms, you would use expo-notifications here
        // import * as Notifications from 'expo-notifications';
        // 
        // Notifications.setNotificationHandler({
        //   handleNotification: async () => ({
        //     shouldShowAlert: true,
        //     shouldPlaySound: true,
        //     shouldSetBadge: true,
        //   }),
        // });
        
        this.isInitialized = true;
        return true;
      }
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
      return false;
    }

    return false;
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          return permission === 'granted';
        }
      } else {
        // For native platforms
        // const { status } = await Notifications.requestPermissionsAsync();
        // return status === 'granted';
        return true; // Mock for now
      }
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
    }
    return false;
  }

  /**
   * Show local notification
   */
  async showNotification(title: string, body: string, data?: any): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/icon.png',
            badge: '/badge.png',
            data,
            requireInteraction: true,
          });
        }
      } else {
        // For native platforms
        // await Notifications.scheduleNotificationAsync({
        //   content: {
        //     title,
        //     body,
        //     data,
        //   },
        //   trigger: null,
        // });
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  /**
   * Schedule notification for later
   */
  async scheduleNotification(
    title: string,
    body: string,
    triggerDate: Date,
    data?: any
  ): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        // Web doesn't support scheduled notifications natively
        // You would need to implement this with a service worker
        console.log('Scheduled notifications not supported on web');
        return null;
      } else {
        // For native platforms
        // const identifier = await Notifications.scheduleNotificationAsync({
        //   content: {
        //     title,
        //     body,
        //     data,
        //   },
        //   trigger: {
        //     date: triggerDate,
        //   },
        // });
        // return identifier;
        return 'mock-id'; // Mock for now
      }
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return null;
    }
  }

  /**
   * Cancel scheduled notification
   */
  async cancelNotification(identifier: string): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        // await Notifications.cancelScheduledNotificationAsync(identifier);
      }
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  /**
   * Get notification permissions status
   */
  async getPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
    try {
      if (Platform.OS === 'web') {
        if ('Notification' in window) {
          return Notification.permission === 'granted' ? 'granted' :
                 Notification.permission === 'denied' ? 'denied' : 'undetermined';
        }
      } else {
        // const { status } = await Notifications.getPermissionsAsync();
        // return status === 'granted' ? 'granted' : 
        //        status === 'denied' ? 'denied' : 'undetermined';
        return 'granted'; // Mock for now
      }
    } catch (error) {
      console.error('Failed to get permission status:', error);
    }
    return 'undetermined';
  }

  /**
   * Set notification badge count (iOS/Android)
   */
  async setBadgeCount(count: number): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        // await Notifications.setBadgeCountAsync(count);
      }
    } catch (error) {
      console.error('Failed to set badge count:', error);
    }
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications(): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        // await Notifications.dismissAllNotificationsAsync();
      }
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();