import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Trophy, Shield, Bell, Moon, Sun, ChevronRight, CreditCard as Edit3, Star, Target, Award, TrendingUp, LogOut, Crown, Zap, Medal, Users, Calendar, Camera, Share, CircleHelp as HelpCircle, Lock, Smartphone } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Spacing, BorderRadius } from '@/constants/Spacing';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  clan?: {
    name: string;
    tag: string;
    role: 'leader' | 'officer' | 'member';
    logo: string;
  };
  level: number;
  xp: number;
  xpToNext: number;
  memberSince: string;
  lastActive: string;
}

interface UserStats {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  mvpCount: number;
  clanWins: number;
  tournamentsWon: number;
  currentStreak: number;
  bestStreak: number;
  rank: number;
  rankTier: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  maxProgress?: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  action: () => void;
  showChevron?: boolean;
  color?: string;
}

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();
  const [darkMode, setDarkMode] = useState(isDark);
  const [notifications, setNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'stats' | 'achievements'>('stats');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Mock user data
  const userProfile: UserProfile = {
    id: 'user_001',
    username: 'ThunderBolt',
    email: 'thunderbolt@email.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    clan: {
      name: 'Thunder Bolts',
      tag: 'THDR',
      role: 'member',
      logo: '⚡',
    },
    level: 42,
    xp: 8750,
    xpToNext: 1250,
    memberSince: '2024-12-15',
    lastActive: '2025-01-15T10:30:00Z',
  };

  const userStats: UserStats = {
    totalMatches: 156,
    wins: 98,
    losses: 58,
    winRate: 62.8,
    mvpCount: 23,
    clanWins: 34,
    tournamentsWon: 8,
    currentStreak: 5,
    bestStreak: 12,
    rank: 42,
    rankTier: 'Diamond',
  };

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Victory',
      description: 'Win your first tournament match',
      icon: '🏆',
      rarity: 'common',
      earned: true,
      earnedDate: '2024-12-20',
    },
    {
      id: '2',
      title: 'Tournament Champion',
      description: 'Win a complete tournament',
      icon: '👑',
      rarity: 'epic',
      earned: true,
      earnedDate: '2025-01-08',
    },
    {
      id: '3',
      title: 'MVP Master',
      description: 'Earn 25 MVP awards',
      icon: '⭐',
      rarity: 'rare',
      earned: false,
      progress: 23,
      maxProgress: 25,
    },
    {
      id: '4',
      title: 'Clan Leader',
      description: 'Lead a clan to victory in 10 matches',
      icon: '⚔️',
      rarity: 'epic',
      earned: false,
      progress: 7,
      maxProgress: 10,
    },
    {
      id: '5',
      title: 'Perfect Score',
      description: 'Win a tournament without losing a match',
      icon: '🎯',
      rarity: 'legendary',
      earned: false,
    },
    {
      id: '6',
      title: 'Streak Master',
      description: 'Win 10 matches in a row',
      icon: '🔥',
      rarity: 'rare',
      earned: true,
      earnedDate: '2025-01-05',
    },
    {
      id: '7',
      title: 'Team Player',
      description: 'Play 100 clan matches',
      icon: '🤝',
      rarity: 'common',
      earned: true,
      earnedDate: '2025-01-10',
    },
    {
      id: '8',
      title: 'Rising Star',
      description: 'Reach Diamond rank',
      icon: '💎',
      rarity: 'epic',
      earned: true,
      earnedDate: '2025-01-12',
    },
  ];

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleTournamentHistory = () => {
    Alert.alert('Tournament History', 'Tournament history feature coming soon!');
  };

  const handleClanManagement = () => {
    Alert.alert('Clan Management', 'Clan management feature coming soon!');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings feature coming soon!');
  };

  const handleShare = () => {
    Alert.alert('Share Profile', 'Profile sharing feature coming soon!');
  };

  const handleHelp = () => {
    Alert.alert('Help & Support', 'Help feature coming soon!');
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy Settings', 'Privacy settings feature coming soon!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              Alert.alert('Signed Out', 'You have been signed out successfully.');
            }, 2000);
          }
        }
      ]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'edit',
      label: 'Edit Profile',
      icon: Edit3,
      action: handleEditProfile,
      showChevron: true,
    },
    {
      id: 'tournaments',
      label: 'Tournament History',
      icon: Trophy,
      action: handleTournamentHistory,
      showChevron: true,
    },
    {
      id: 'clan',
      label: 'Clan Management',
      icon: Shield,
      action: handleClanManagement,
      showChevron: true,
    },
    {
      id: 'share',
      label: 'Share Profile',
      icon: Share,
      action: handleShare,
      showChevron: true,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      action: handleSettings,
      showChevron: true,
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      action: handleHelp,
      showChevron: true,
    },
    {
      id: 'privacy',
      label: 'Privacy Settings',
      icon: Lock,
      action: handlePrivacy,
      showChevron: true,
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '#9CA3AF';
      case 'rare':
        return '#3B82F6';
      case 'epic':
        return '#8B5CF6';
      case 'legendary':
        return '#F59E0B';
      default:
        return colors.textSecondary;
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'rgba(245, 158, 11, 0.3)';
      case 'epic':
        return 'rgba(139, 92, 246, 0.3)';
      case 'rare':
        return 'rgba(59, 130, 246, 0.3)';
      default:
        return 'transparent';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const renderStatCard = (icon: React.ComponentType<any>, label: string, value: string, color: string) => {
    const IconComponent = icon;
    return (
      <View style={styles.statCard}>
        <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
          <IconComponent size={20} color={color} />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    );
  };

  const renderAchievement = (achievement: Achievement) => (
    <View 
      key={achievement.id} 
      style={[
        styles.achievementCard,
        achievement.earned && styles.achievementEarned,
        achievement.rarity === 'legendary' && styles.legendaryAchievement,
      ]}
    >
      {achievement.rarity === 'legendary' && achievement.earned && (
        <View style={[styles.achievementGlow, { backgroundColor: getRarityGlow(achievement.rarity) }]} />
      )}
      
      <View style={styles.achievementHeader}>
        <View style={styles.achievementIconContainer}>
          <Text style={[
            styles.achievementIcon,
            !achievement.earned && styles.achievementIconLocked
          ]}>
            {achievement.earned ? achievement.icon : '🔒'}
          </Text>
          <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(achievement.rarity) }]}>
            <Text style={styles.rarityText}>
              {achievement.rarity.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.achievementInfo}>
          <Text style={[
            styles.achievementTitle,
            !achievement.earned && styles.achievementTitleLocked
          ]}>
            {achievement.title}
          </Text>
          <Text style={styles.achievementDescription}>
            {achievement.description}
          </Text>
          
          {achievement.earned && achievement.earnedDate && (
            <Text style={styles.achievementDate}>
              Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
            </Text>
          )}
          
          {!achievement.earned && achievement.progress !== undefined && achievement.maxProgress && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                      backgroundColor: getRarityColor(achievement.rarity),
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {achievement.progress}/{achievement.maxProgress}
              </Text>
            </View>
          )}
        </View>
        
        {achievement.earned && (
          <View style={styles.achievementBadge}>
            <CheckCircle size={16} color={colors.accent} />
          </View>
        )}
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0F0E17',
    },
    header: {
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.xxxl,
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: Spacing.lg,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: 'rgba(127, 90, 240, 0.3)',
    },
    avatarImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    avatarText: {
      fontSize: FontSize.xxxl,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    avatarEdit: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#0F0E17',
    },
    levelBadge: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: colors.accent,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      borderColor: '#0F0E17',
    },
    levelText: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    userInfo: {
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    userName: {
      fontSize: FontSize.xxl,
      fontFamily: 'Poppins-Bold',
      color: '#FFFFFF',
      marginBottom: Spacing.xs,
    },
    userEmail: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: Spacing.sm,
    },
    clanInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(127, 90, 240, 0.1)',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: 'rgba(127, 90, 240, 0.3)',
      marginBottom: Spacing.md,
    },
    clanLogo: {
      fontSize: FontSize.base,
      marginRight: Spacing.sm,
    },
    clanText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: colors.primary,
    },
    xpContainer: {
      width: '100%',
      alignItems: 'center',
    },
    xpBar: {
      width: '80%',
      height: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: Spacing.sm,
    },
    xpFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    xpText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    memberSince: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.5)',
      marginTop: Spacing.sm,
    },
    content: {
      flex: 1,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    tab: {
      flex: 1,
      paddingVertical: Spacing.md,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: 'rgba(255, 255, 255, 0.6)',
    },
    activeTabText: {
      color: colors.primary,
    },
    tabContent: {
      flex: 1,
    },
    statsContainer: {
      padding: Spacing.xl,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: Spacing.xl,
    },
    statCard: {
      width: '48%',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      alignItems: 'center',
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    statValue: {
      fontSize: FontSize.xl,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginBottom: Spacing.xs,
    },
    statLabel: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.7)',
      textAlign: 'center',
    },
    rankCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
      alignItems: 'center',
    },
    rankTitle: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginBottom: Spacing.sm,
    },
    rankTier: {
      fontSize: FontSize.xxl,
      fontFamily: 'Poppins-Bold',
      color: colors.primary,
      marginBottom: Spacing.xs,
    },
    rankNumber: {
      fontSize: FontSize.lg,
      fontFamily: 'Inter-Bold',
      color: 'rgba(255, 255, 255, 0.8)',
    },
    achievementsContainer: {
      padding: Spacing.xl,
    },
    achievementCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
      position: 'relative',
      overflow: 'hidden',
    },
    achievementEarned: {
      borderColor: 'rgba(44, 182, 125, 0.3)',
      backgroundColor: 'rgba(44, 182, 125, 0.05)',
    },
    legendaryAchievement: {
      borderColor: 'rgba(245, 158, 11, 0.5)',
      backgroundColor: 'rgba(245, 158, 11, 0.05)',
    },
    achievementGlow: {
      position: 'absolute',
      top: -2,
      left: -2,
      right: -2,
      bottom: -2,
      borderRadius: BorderRadius.lg,
      opacity: 0.5,
    },
    achievementHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    achievementIconContainer: {
      position: 'relative',
      marginRight: Spacing.md,
    },
    achievementIcon: {
      fontSize: FontSize.xxl,
      opacity: 1,
    },
    achievementIconLocked: {
      opacity: 0.3,
    },
    rarityBadge: {
      position: 'absolute',
      bottom: -4,
      right: -4,
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#0F0E17',
    },
    rarityText: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    achievementInfo: {
      flex: 1,
    },
    achievementTitle: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginBottom: Spacing.xs,
    },
    achievementTitleLocked: {
      color: 'rgba(255, 255, 255, 0.5)',
    },
    achievementDescription: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: Spacing.xs,
    },
    achievementDate: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-Regular',
      color: colors.accent,
    },
    progressContainer: {
      marginTop: Spacing.sm,
    },
    progressBar: {
      height: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 2,
      overflow: 'hidden',
      marginBottom: Spacing.xs,
    },
    progressFill: {
      height: '100%',
      borderRadius: 2,
    },
    progressText: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-Medium',
      color: 'rgba(255, 255, 255, 0.6)',
    },
    achievementBadge: {
      marginLeft: Spacing.sm,
    },
    section: {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      marginBottom: Spacing.md,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    sectionTitle: {
      fontSize: FontSize.lg,
      fontFamily: 'Poppins-SemiBold',
      color: '#FFFFFF',
      marginLeft: Spacing.sm,
    },
    menuList: {
      paddingHorizontal: Spacing.xl,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    menuItemContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuItemIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    menuItemText: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Medium',
      color: '#FFFFFF',
      flex: 1,
    },
    settingsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    settingsItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingsItemIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    settingsItemText: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Medium',
      color: '#FFFFFF',
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
    logoutIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    logoutText: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Medium',
      color: colors.error,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 14, 23, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Medium',
      color: '#FFFFFF',
      marginTop: Spacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <View style={styles.avatarContainer}>
          {userProfile.avatar ? (
            <Image source={{ uri: userProfile.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userProfile.username.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.avatarEdit}>
            <Camera size={16} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>LVL {userProfile.level}</Text>
          </View>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userProfile.username}</Text>
          <Text style={styles.userEmail}>{userProfile.email}</Text>
          
          {userProfile.clan && (
            <View style={styles.clanInfo}>
              <Text style={styles.clanLogo}>{userProfile.clan.logo}</Text>
              <Text style={styles.clanText}>
                {userProfile.clan.name} [{userProfile.clan.tag}] • {userProfile.clan.role}
              </Text>
            </View>
          )}

          <View style={styles.xpContainer}>
            <View style={styles.xpBar}>
              <View 
                style={[
                  styles.xpFill,
                  { width: `${(userProfile.xp / (userProfile.xp + userProfile.xpToNext)) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.xpText}>
              {userProfile.xp.toLocaleString()} / {(userProfile.xp + userProfile.xpToNext).toLocaleString()} XP
            </Text>
          </View>

          <Text style={styles.memberSince}>
            Member since {formatDate(userProfile.memberSince)}
          </Text>
        </View>
      </Animated.View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'stats' && styles.activeTab]}
          onPress={() => setSelectedTab('stats')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'stats' && styles.activeTabText
          ]}>
            Statistics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'achievements' && styles.activeTab]}
          onPress={() => setSelectedTab('achievements')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'achievements' && styles.activeTabText
          ]}>
            Achievements
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {selectedTab === 'stats' ? (
          <View style={styles.statsContainer}>
            <View style={styles.statsGrid}>
              {renderStatCard(Trophy, 'Matches Played', userStats.totalMatches.toString(), colors.primary)}
              {renderStatCard(Target, 'Win Rate', `${userStats.winRate}%`, colors.accent)}
              {renderStatCard(Star, 'MVP Awards', userStats.mvpCount.toString(), '#FFD700')}
              {renderStatCard(Shield, 'Clan Wins', userStats.clanWins.toString(), colors.primary)}
              {renderStatCard(Crown, 'Tournaments Won', userStats.tournamentsWon.toString(), '#FF4655')}
              {renderStatCard(Zap, 'Current Streak', userStats.currentStreak.toString(), colors.warning)}
            </View>

            <View style={styles.rankCard}>
              <Text style={styles.rankTitle}>Current Rank</Text>
              <Text style={styles.rankTier}>{userStats.rankTier}</Text>
              <Text style={styles.rankNumber}>#{userStats.rank}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.achievementsContainer}>
            {achievements.map(renderAchievement)}
          </View>
        )}

        {/* Menu Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Account</Text>
          </View>
          <View style={styles.menuList}>
            {menuItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.action}>
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemIcon}>
                    <item.icon size={20} color={item.color || 'rgba(255, 255, 255, 0.7)'} />
                  </View>
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </View>
                {item.showChevron && (
                  <ChevronRight size={20} color="rgba(255, 255, 255, 0.4)" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={styles.settingsItemIcon}>
                <Bell size={20} color="rgba(255, 255, 255, 0.7)" />
              </View>
              <Text style={styles.settingsItemText}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: colors.primary }}
              thumbColor={notifications ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'}
            />
          </View>
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={styles.settingsItemIcon}>
                {isDark ? (
                  <Moon size={20} color="rgba(255, 255, 255, 0.7)" />
                ) : (
                  <Sun size={20} color="rgba(255, 255, 255, 0.7)" />
                )}
              </View>
              <Text style={styles.settingsItemText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: colors.primary }}
              thumbColor={darkMode ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'}
            />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.logoutIcon}>
            <LogOut size={20} color={colors.error} />
          </View>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Signing out...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}