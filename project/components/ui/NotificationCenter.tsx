import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Bell, Trophy, Users, Zap, Crown, Settings, Check, Trash2, Filter, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Grid, Typography, ComponentSpecs } from '@/constants/DesignSystem';

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

interface NotificationCenterProps {
  visible: boolean;
  onClose: () => void;
  notifications: Notification[];
  onNotificationPress?: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onDeleteNotification?: (notificationId: string) => void;
}

export default function NotificationCenter({
  visible,
  onClose,
  notifications: propNotifications,
  onNotificationPress,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
}: NotificationCenterProps) {
  const { colors } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    clanChallenges: true,
    matchUpdates: true,
    gameInvites: true,
    achievements: true,
    system: false,
  });

  // Mock notifications if none provided
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'clan_challenge',
      title: 'Clan Challenge',
      message: 'Thunder Bolts vs Phoenix Rising starts in 30 minutes',
      timestamp: '2025-01-15T14:30:00Z',
      isRead: false,
      priority: 'high',
      actionable: true,
    },
    {
      id: '2',
      type: 'match_update',
      title: 'Match Result',
      message: 'Your team won the Championship League quarterfinal!',
      timestamp: '2025-01-15T13:45:00Z',
      isRead: false,
      priority: 'medium',
    },
    {
      id: '3',
      type: 'game_invite',
      title: 'Game Invitation',
      message: 'StormKing invited you to join Elite Cup tournament',
      timestamp: '2025-01-15T12:20:00Z',
      isRead: true,
      priority: 'medium',
      actionable: true,
    },
    {
      id: '4',
      type: 'achievement',
      title: 'Achievement Unlocked',
      message: 'You earned the "Tournament Champion" badge!',
      timestamp: '2025-01-15T11:15:00Z',
      isRead: true,
      priority: 'low',
    },
    {
      id: '5',
      type: 'system',
      title: 'System Update',
      message: 'New features available in the latest app update',
      timestamp: '2025-01-15T09:00:00Z',
      isRead: true,
      priority: 'low',
    },
  ];

  const notifications = propNotifications.length > 0 ? propNotifications : mockNotifications;

  const filters = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'unread', label: 'Unread', count: notifications.filter(n => !n.isRead).length },
    { key: 'clan_challenge', label: 'Challenges', count: notifications.filter(n => n.type === 'clan_challenge').length },
    { key: 'match_update', label: 'Matches', count: notifications.filter(n => n.type === 'match_update').length },
    { key: 'game_invite', label: 'Invites', count: notifications.filter(n => n.type === 'game_invite').length },
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.isRead;
    return notification.type === selectedFilter;
  });

  const getNotificationIcon = (type: string, priority: string) => {
    const iconColor = priority === 'high' ? colors.error : 
                     priority === 'medium' ? colors.primary : colors.textSecondary;
    
    switch (type) {
      case 'clan_challenge':
        return <Zap size={20} color={iconColor} />;
      case 'match_update':
        return <Trophy size={20} color={iconColor} />;
      case 'game_invite':
        return <Users size={20} color={iconColor} />;
      case 'achievement':
        return <Crown size={20} color={iconColor} />;
      case 'system':
        return <Bell size={20} color={iconColor} />;
      default:
        return <Bell size={20} color={iconColor} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      onMarkAsRead?.(notification.id);
    }
    onNotificationPress?.(notification);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
      marginTop: 60, // Status bar + some margin
      borderTopLeftRadius: Grid.lg,
      borderTopRightRadius: Grid.lg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Grid.xl,
      paddingVertical: Grid.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Grid.sm,
    },
    title: {
      ...Typography.titleLarge,
      color: colors.text,
    },
    badge: {
      backgroundColor: colors.error,
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 2,
      minWidth: 20,
      alignItems: 'center',
    },
    badgeText: {
      ...Typography.labelSmall,
      color: '#FFFFFF',
    },
    headerActions: {
      flexDirection: 'row',
      gap: Grid.sm,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filtersContainer: {
      paddingHorizontal: Grid.xl,
      paddingVertical: Grid.md,
      backgroundColor: colors.surface,
    },
    filtersScroll: {
      flexDirection: 'row',
      gap: Grid.sm,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Grid.md,
      paddingVertical: Grid.sm,
      borderRadius: ComponentSpecs.button.borderRadius,
      borderWidth: 1,
      gap: Grid.xs,
    },
    filterChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterChipInactive: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    filterChipText: {
      ...Typography.labelMedium,
    },
    filterChipTextActive: {
      color: '#FFFFFF',
    },
    filterChipTextInactive: {
      color: colors.textSecondary,
    },
    filterCount: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 8,
      paddingHorizontal: 4,
      paddingVertical: 1,
      minWidth: 16,
      alignItems: 'center',
    },
    filterCountInactive: {
      backgroundColor: colors.surfaceVariant,
    },
    filterCountText: {
      fontSize: 10,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    filterCountTextInactive: {
      color: colors.textTertiary,
    },
    content: {
      flex: 1,
    },
    notificationsList: {
      flex: 1,
      paddingHorizontal: Grid.xl,
    },
    notificationItem: {
      flexDirection: 'row',
      paddingVertical: Grid.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    notificationItemUnread: {
      backgroundColor: `${colors.primary}05`,
    },
    notificationIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Grid.md,
    },
    notificationContent: {
      flex: 1,
      marginRight: Grid.sm,
    },
    notificationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: Grid.xs,
    },
    notificationTitle: {
      ...Typography.titleSmall,
      color: colors.text,
      flex: 1,
      marginRight: Grid.sm,
    },
    notificationTime: {
      ...Typography.labelSmall,
      color: colors.textSecondary,
    },
    notificationMessage: {
      ...Typography.bodyMedium,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: Grid.sm,
    },
    notificationActions: {
      flexDirection: 'row',
      gap: Grid.sm,
    },
    actionButton: {
      paddingHorizontal: Grid.md,
      paddingVertical: Grid.xs,
      borderRadius: ComponentSpecs.button.borderRadius,
      borderWidth: 1,
    },
    primaryAction: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    secondaryAction: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    actionButtonText: {
      ...Typography.labelMedium,
    },
    primaryActionText: {
      color: '#FFFFFF',
    },
    secondaryActionText: {
      color: colors.textSecondary,
    },
    notificationMenu: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    unreadIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
      position: 'absolute',
      top: 0,
      right: 0,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Grid.xxxxl,
    },
    emptyStateIcon: {
      marginBottom: Grid.lg,
    },
    emptyStateTitle: {
      ...Typography.titleMedium,
      color: colors.text,
      marginBottom: Grid.sm,
    },
    emptyStateText: {
      ...Typography.bodyMedium,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: Grid.xl,
    },
    settingsModal: {
      flex: 1,
      backgroundColor: colors.background,
    },
    settingsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Grid.xl,
      paddingVertical: Grid.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingsTitle: {
      ...Typography.titleLarge,
      color: colors.text,
    },
    settingsContent: {
      flex: 1,
      paddingHorizontal: Grid.xl,
      paddingTop: Grid.lg,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Grid.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingLabel: {
      ...Typography.bodyLarge,
      color: colors.text,
    },
    settingDescription: {
      ...Typography.bodySmall,
      color: colors.textSecondary,
      marginTop: Grid.xs,
    },
  });

  const renderNotificationSettings = () => (
    <Modal visible={showSettings} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.settingsModal}>
        <View style={styles.settingsHeader}>
          <Text style={styles.settingsTitle}>Notification Settings</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowSettings(false)}
          >
            <X size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.settingsContent}>
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Clan Challenges</Text>
              <Text style={styles.settingDescription}>
                Get notified about upcoming clan matches and challenges
              </Text>
            </View>
            <Switch
              value={notificationSettings.clanChallenges}
              onValueChange={(value) =>
                setNotificationSettings(prev => ({ ...prev, clanChallenges: value }))
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notificationSettings.clanChallenges ? '#FFFFFF' : colors.textSecondary}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Match Updates</Text>
              <Text style={styles.settingDescription}>
                Receive updates about your tournament matches and results
              </Text>
            </View>
            <Switch
              value={notificationSettings.matchUpdates}
              onValueChange={(value) =>
                setNotificationSettings(prev => ({ ...prev, matchUpdates: value }))
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notificationSettings.matchUpdates ? '#FFFFFF' : colors.textSecondary}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Game Invitations</Text>
              <Text style={styles.settingDescription}>
                Get notified when someone invites you to join a tournament
              </Text>
            </View>
            <Switch
              value={notificationSettings.gameInvites}
              onValueChange={(value) =>
                setNotificationSettings(prev => ({ ...prev, gameInvites: value }))
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notificationSettings.gameInvites ? '#FFFFFF' : colors.textSecondary}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Achievements</Text>
              <Text style={styles.settingDescription}>
                Celebrate your accomplishments with achievement notifications
              </Text>
            </View>
            <Switch
              value={notificationSettings.achievements}
              onValueChange={(value) =>
                setNotificationSettings(prev => ({ ...prev, achievements: value }))
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notificationSettings.achievements ? '#FFFFFF' : colors.textSecondary}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>System Announcements</Text>
              <Text style={styles.settingDescription}>
                Important updates and announcements from Matchmaster
              </Text>
            </View>
            <Switch
              value={notificationSettings.system}
              onValueChange={(value) =>
                setNotificationSettings(prev => ({ ...prev, system: value }))
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notificationSettings.system ? '#FFFFFF' : colors.textSecondary}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.headerActions}>
            {unreadCount > 0 && (
              <TouchableOpacity style={styles.iconButton} onPress={onMarkAllAsRead}>
                <Check size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowSettings(true)}
            >
              <Settings size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterChip,
                  selectedFilter === filter.key
                    ? styles.filterChipActive
                    : styles.filterChipInactive,
                ]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilter === filter.key
                      ? styles.filterChipTextActive
                      : styles.filterChipTextInactive,
                  ]}
                >
                  {filter.label}
                </Text>
                <View
                  style={[
                    styles.filterCount,
                    selectedFilter !== filter.key && styles.filterCountInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterCountText,
                      selectedFilter !== filter.key && styles.filterCountTextInactive,
                    ]}
                  >
                    {filter.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Notifications List */}
        <View style={styles.content}>
          {filteredNotifications.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Bell size={48} color={colors.textSecondary} />
              </View>
              <Text style={styles.emptyStateTitle}>No notifications</Text>
              <Text style={styles.emptyStateText}>
                {selectedFilter === 'all'
                  ? "You're all caught up! No new notifications."
                  : `No ${selectedFilter === 'unread' ? 'unread' : selectedFilter} notifications.`}
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
              {filteredNotifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    !notification.isRead && styles.notificationItemUnread,
                  ]}
                  onPress={() => handleNotificationPress(notification)}
                  activeOpacity={0.8}
                >
                  <View style={styles.notificationIcon}>
                    {getNotificationIcon(notification.type, notification.priority)}
                    {!notification.isRead && <View style={styles.unreadIndicator} />}
                  </View>

                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationTitle} numberOfLines={1}>
                        {notification.title}
                      </Text>
                      <Text style={styles.notificationTime}>
                        {formatTimestamp(notification.timestamp)}
                      </Text>
                    </View>

                    <Text style={styles.notificationMessage} numberOfLines={2}>
                      {notification.message}
                    </Text>

                    {notification.actionable && (
                      <View style={styles.notificationActions}>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.primaryAction]}
                          onPress={() => handleNotificationPress(notification)}
                        >
                          <Text style={[styles.actionButtonText, styles.primaryActionText]}>
                            View
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.secondaryAction]}
                          onPress={() => onDeleteNotification?.(notification.id)}
                        >
                          <Text style={[styles.actionButtonText, styles.secondaryActionText]}>
                            Dismiss
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.notificationMenu}
                    onPress={() => onDeleteNotification?.(notification.id)}
                  >
                    <Trash2 size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {renderNotificationSettings()}
      </SafeAreaView>
    </Modal>
  );
}