import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Trophy, Shield, Bell, Moon, Sun, ChevronRight, CreditCard as Edit3, Star, Target, Award, TrendingUp, LogOut } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, FontWeight, Spacing, BorderRadius } from '@/constants/Spacing';
import { userService } from '@/services/userService';
import { useAuthContext } from '@/components/AuthProvider';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { router } from 'expo-router';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  date?: string;
}

interface Stat {
  label: string;
  value: string;
  icon: any;
}

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();
  const { user, userProfile, isAuthenticated } = useAuthContext();
  const [darkMode, setDarkMode] = useState(isDark);
  const [notifications, setNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // User data states
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const [userClan, setUserClan] = useState<any>(null);

  useEffect(() => {
    if (user && isAuthenticated) {
      loadUserData();
    }
  }, [user, isAuthenticated]);

  const loadUserData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Load user profile
      const userProfileResult = await userService.getUserProfile(user.id);
      if (!userProfileResult.success) {
        throw new Error(userProfileResult.error || 'Failed to load user profile');
      }
      
      setCurrentUserProfile(userProfileResult.data);
      
      // Load user clan
      const userClanResult = await userService.getUserClan(user.id);
      if (userClanResult.success) {
        setUserClan(userClanResult.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadUserData();
    setIsRefreshing(false);
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            setIsSigningOut(true);
            try {
              // Navigate to the logout screen which handles the sign out process
              router.replace('/auth/logout');
            } catch (error) {
              console.error('Navigation error:', error);
              setIsSigningOut(false);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Mock achievements - in a real app, these would come from a service
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Victory',
      description: 'Win your first tournament',
      icon: '🏆',
      earned: true,
      date: 'Dec 15, 2024',
    },
    {
      id: '2',
      title: 'Tournament Master',
      description: 'Win 5 tournaments',
      icon: '👑',
      earned: true,
      date: 'Jan 8, 2025',
    },
    {
      id: '3',
      title: 'Clan Leader',
      description: 'Lead a clan to victory',
      icon: '⚔️',
      earned: false,
    },
    {
      id: '4',
      title: 'Perfect Score',
      description: 'Win a tournament without losing a match',
      icon: '🎯',
      earned: false,
    },
  ];

  const menuItems = [
    { label: 'Edit Profile', icon: Edit3, action: () => {} },
    { label: 'Tournament History', icon: Trophy, action: () => {} },
    { label: 'Clan Management', icon: Shield, action: () => {} },
    { label: 'Settings', icon: Settings, action: () => {} },
  ];

  const getUserStats = (): Stat[] => {
    if (!currentUserProfile) return [];
    
    const stats = currentUserProfile.stats || {};
    
    return [
      { label: 'Tournaments', value: stats.total_matches?.toString() || '0', icon: Trophy },
      { label: 'Wins', value: stats.wins?.toString() || '0', icon: Target },
      { label: 'Win Rate', value: `${stats.win_rate || 0}%`, icon: TrendingUp },
      { label: 'Rank', value: `#${stats.rank || 'N/A'}`, icon: Award },
    ];
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      alignItems: 'center',
      padding: Spacing.xl,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    userName: {
      fontSize: FontSize.xxl,
      fontFamily: 'Poppins-Bold',
      color: colors.text,
      marginBottom: Spacing.xs,
    },
    userEmail: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: Spacing.md,
    },
    memberSince: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    content: {
      flex: 1,
      paddingBottom: Spacing.xl,
    },
    section: {
      backgroundColor: colors.card,
      marginBottom: Spacing.md,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionTitle: {
      fontSize: FontSize.lg,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
      marginLeft: Spacing.sm,
    },
    statsContainer: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      fontSize: FontSize.xl,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: Spacing.xs,
    },
    statLabel: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    achievementsList: {
      paddingHorizontal: Spacing.xl,
    },
    achievementItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    achievementIcon: {
      fontSize: FontSize.xxl,
      marginRight: Spacing.md,
      opacity: 1,
    },
    achievementIconEarned: {
      opacity: 1,
    },
    achievementIconNotEarned: {
      opacity: 0.3,
    },
    achievementContent: {
      flex: 1,
    },
    achievementTitle: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: Spacing.xs,
    },
    achievementDescription: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    achievementDate: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-Regular',
      color: colors.accent,
      marginTop: Spacing.xs,
    },
    achievementBadge: {
      backgroundColor: colors.accent,
      borderRadius: BorderRadius.sm,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
    },
    achievementBadgeText: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    menuList: {
      paddingHorizontal: Spacing.xl,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuItemContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuItemText: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      marginLeft: Spacing.md,
    },
    settingsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingsItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingsItemText: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      marginLeft: Spacing.md,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderTopWidth: 1,
      borderTopColor: 'rgba(239, 68, 68, 0.2)',
    },
    logoutText: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Medium',
      color: colors.error,
      marginLeft: Spacing.md,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    loadingText: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Medium',
      color: '#FFFFFF',
      marginTop: Spacing.md,
    },
  });

  if (!isAuthenticated) {
    return (
      <LoadingState message="Please sign in to view your profile..." />
    );
  }

  if (isLoading) {
    return <LoadingState message="Loading profile..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load profile"
        message={error}
        onRetry={loadUserData}
      />
    );
  }

  if (!currentUserProfile) {
    return (
      <ErrorState
        title="Profile not found"
        message="We couldn't find your profile information."
        onRetry={loadUserData}
      />
    );
  }

  const userStats = getUserStats();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User size={40} color="#FFFFFF" />
        </View>
        <Text style={styles.userName}>{currentUserProfile.display_name}</Text>
        <Text style={styles.userEmail}>{currentUserProfile.email}</Text>
        <Text style={styles.memberSince}>
          Member since {new Date(currentUserProfile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Trophy size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Statistics</Text>
          </View>
          <View style={styles.statsContainer}>
            {userStats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <stat.icon size={20} color={colors.primary} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Star size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Achievements</Text>
          </View>
          <View style={styles.achievementsList}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementItem}>
                <Text
                  style={[
                    styles.achievementIcon,
                    achievement.earned
                      ? styles.achievementIconEarned
                      : styles.achievementIconNotEarned,
                  ]}
                >
                  {achievement.icon}
                </Text>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                  {achievement.earned && achievement.date && (
                    <Text style={styles.achievementDate}>
                      Earned on {achievement.date}
                    </Text>
                  )}
                </View>
                {achievement.earned && (
                  <View style={styles.achievementBadge}>
                    <Text style={styles.achievementBadgeText}>Earned</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.menuList}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
                <View style={styles.menuItemContent}>
                  <item.icon size={20} color={colors.textSecondary} />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Bell size={20} color={colors.textSecondary} />
              <Text style={styles.settingsItemText}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notifications ? '#FFFFFF' : colors.textSecondary}
            />
          </View>
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              {isDark ? (
                <Moon size={20} color={colors.textSecondary} />
              ) : (
                <Sun size={20} color={colors.textSecondary} />
              )}
              <Text style={styles.settingsItemText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={darkMode ? '#FFFFFF' : colors.textSecondary}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={styles.logoutText}>
            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Loading Overlay for Sign Out */}
      {isSigningOut && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Signing out...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}