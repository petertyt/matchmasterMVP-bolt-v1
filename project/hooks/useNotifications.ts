import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

interface Notification {
  id: string;
  type: 'clan_challenge' | 'match_update' | 'game_invite' | 'system' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionable?: boolean;
  data?: any;
}

interface NotificationSettings {
  clanChallenges: boolean;
  matchUpdates: boolean;
  gameInvites: boolean;
  achievements: boolean;
  system: boolean;
  pushNotifications: boolean;
}

/**
 * Hook for managing notifications and push notification permissions
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    clanChallenges: true,
    matchUpdates: true,
    gameInvites: true,
    achievements: true,
    system: false,
    pushNotifications: false,
  });
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');

  /**
   * Request push notification permissions
   */
  const requestPermissions = useCallback(async () => {
    if (Platform.OS === 'web') {
      // Web push notifications
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission === 'granted' ? 'granted' : 'denied');
        return permission === 'granted';
      }
      return false;
    } else {
      // For native platforms, you would use expo-notifications here
      // import * as Notifications from 'expo-notifications';
      // const { status } = await Notifications.requestPermissionsAsync();
      // setPermissionStatus(status === 'granted' ? 'granted' : 'denied');
      // return status === 'granted';
      
      // Mock for now
      setPermissionStatus('granted');
      return true;
    }
  }, []);

  /**
   * Add a new notification
   */
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show push notification if permissions are granted
    if (permissionStatus === 'granted' && settings.pushNotifications) {
      showPushNotification(newNotification);
    }

    return newNotification.id;
  }, [permissionStatus, settings.pushNotifications]);

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  }, []);

  /**
   * Delete a notification
   */
  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  }, []);

  /**
   * Clear all notifications
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  /**
   * Update notification settings
   */
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  /**
   * Show push notification (platform-specific)
   */
  const showPushNotification = useCallback((notification: Notification) => {
    if (Platform.OS === 'web') {
      // Web push notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/icon.png', // Your app icon
          badge: '/badge.png', // Badge icon
          tag: notification.id,
        });
      }
    } else {
      // For native platforms, you would use expo-notifications here
      // Notifications.scheduleNotificationAsync({
      //   content: {
      //     title: notification.title,
      //     body: notification.message,
      //     data: notification.data,
      //   },
      //   trigger: null, // Show immediately
      // });
    }
  }, []);

  /**
   * Get unread notification count
   */
  const unreadCount = notifications.filter(n => !n.isRead).length;

  /**
   * Get notifications by type
   */
  const getNotificationsByType = useCallback((type: Notification['type']) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  /**
   * Get high priority notifications
   */
  const getHighPriorityNotifications = useCallback(() => {
    return notifications.filter(n => n.priority === 'high' && !n.isRead);
  }, [notifications]);

  // Initialize permissions on mount
  useEffect(() => {
    if (Platform.OS === 'web') {
      if ('Notification' in window) {
        setPermissionStatus(
          Notification.permission === 'granted' ? 'granted' :
          Notification.permission === 'denied' ? 'denied' : 'undetermined'
        );
      }
    }
  }, []);

  // Mock some initial notifications for demo
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'clan_challenge',
        title: 'Clan Challenge',
        message: 'Thunder Bolts vs Phoenix Rising starts in 30 minutes',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'high',
        actionable: true,
      },
      {
        id: '2',
        type: 'match_update',
        title: 'Match Result',
        message: 'Your team won the Championship League quarterfinal!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'medium',
      },
      {
        id: '3',
        type: 'achievement',
        title: 'Achievement Unlocked',
        message: 'You earned the "Tournament Champion" badge!',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        priority: 'low',
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  return {
    // State
    notifications,
    settings,
    permissionStatus,
    unreadCount,

    // Actions
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    requestPermissions,

    // Getters
    getNotificationsByType,
    getHighPriorityNotifications,
  };
}

export type { Notification, NotificationSettings };