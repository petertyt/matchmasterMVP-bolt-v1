import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell, User, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Grid, Typography, ComponentSpecs } from '@/constants/DesignSystem';
import SearchBar from './SearchBar';
import NotificationCenter from './NotificationCenter';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  onSearchChange?: (query: string) => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  notificationCount?: number;
}

export default function Header({
  title,
  subtitle,
  showSearch = true,
  showNotifications = true,
  showProfile = true,
  onSearchChange,
  onNotificationPress,
  onProfilePress,
  notificationCount = 3,
}: HeaderProps) {
  const { colors } = useTheme();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const handleSearchChange = (query: string) => {
    onSearchChange?.(query);
  };

  const handleNotificationPress = () => {
    setShowNotificationCenter(true);
    onNotificationPress?.();
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 16, // Fixed 16px bottom padding as requested
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Grid.xl,
      paddingTop: Grid.lg,
      minHeight: 60,
      position: 'relative',
    },
    leftSection: {
      flex: 1,
      justifyContent: 'center',
    },
    titleContainer: {
      opacity: isSearchExpanded ? 0 : 1,
      display: isSearchExpanded ? 'none' : 'flex',
    },
    title: {
      ...Typography.headlineSmall,
      color: colors.text,
      lineHeight: 32,
    },
    subtitle: {
      ...Typography.bodyMedium,
      color: colors.textSecondary,
      marginTop: 2,
      lineHeight: 20,
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Grid.sm,
      zIndex: 10,
      display: isSearchExpanded ? 'none' : 'flex',
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      position: 'relative',
    },
    notificationBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.error,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.background,
    },
    badgeText: {
      ...Typography.labelSmall,
      color: '#FFFFFF',
      fontSize: 10,
    },
    searchBarContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 60,
      justifyContent: 'center',
      paddingHorizontal: Grid.xl,
      zIndex: isSearchExpanded ? 20 : -1,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          {showSearch && (
            <SearchBar
              isExpanded={isSearchExpanded}
              onToggle={toggleSearch}
              onSearchChange={handleSearchChange}
            />
          )}
        </View>

        <View style={styles.rightSection}>
          {showSearch && (
            <TouchableOpacity style={styles.iconButton} onPress={toggleSearch}>
              <Search size={20} color={colors.text} />
            </TouchableOpacity>
          )}
          
          {showNotifications && (
            <TouchableOpacity style={styles.iconButton} onPress={handleNotificationPress}>
              <Bell size={20} color={colors.text} />
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          
          {showProfile && (
            <TouchableOpacity style={styles.iconButton} onPress={onProfilePress}>
              <User size={20} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Notification Center */}
      <NotificationCenter
        visible={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        notifications={[]} // Will use mock data
        onNotificationPress={(notification) => {
          console.log('Notification pressed:', notification);
          setShowNotificationCenter(false);
        }}
        onMarkAsRead={(id) => console.log('Mark as read:', id)}
        onMarkAllAsRead={() => console.log('Mark all as read')}
        onDeleteNotification={(id) => console.log('Delete notification:', id)}
      />
    </SafeAreaView>
  );
}