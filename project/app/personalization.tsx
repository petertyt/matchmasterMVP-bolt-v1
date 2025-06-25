import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gamepad2, Target, Zap, Trophy, Crown, Swords, Circle, CircleCheck as CheckCircle2, ArrowRight, Sparkles, Bell, BellOff, Clock } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuthContext } from '@/components/AuthProvider';
import { Grid, Typography, ComponentSpecs } from '@/constants/DesignSystem';

const { width } = Dimensions.get('window');

interface GameOption {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string[];
  category: 'esports' | 'traditional';
}

interface NotificationOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export default function PersonalizationScreen() {
  const { colors } = useTheme();
  const { user, userProfile } = useAuthContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<Record<string, boolean>>({
    clan_challenges: true,
    match_updates: true,
    game_invites: true,
    achievements: true,
    system: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Check if user has completed personalization before
  useEffect(() => {
    const checkPersonalizationStatus = async () => {
      try {
        const hasCompletedPersonalization = await AsyncStorage.getItem('hasCompletedPersonalization');
        if (hasCompletedPersonalization === 'true') {
          // User has already completed personalization, go to main app
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Error checking personalization status:', error);
      }
    };

    checkPersonalizationStatus();
  }, []);

  const gameOptions: GameOption[] = [
    {
      id: 'valorant',
      name: 'Valorant',
      icon: Target,
      color: '#FF4655',
      gradient: ['rgba(255, 70, 85, 0.2)', 'rgba(255, 70, 85, 0.05)'],
      category: 'esports',
    },
    {
      id: 'csgo',
      name: 'CS:GO',
      icon: Zap,
      color: '#F99500',
      gradient: ['rgba(249, 149, 0, 0.2)', 'rgba(249, 149, 0, 0.05)'],
      category: 'esports',
    },
    {
      id: 'lol',
      name: 'League of Legends',
      icon: Crown,
      color: '#C89B3C',
      gradient: ['rgba(200, 155, 60, 0.2)', 'rgba(200, 155, 60, 0.05)'],
      category: 'esports',
    },
    {
      id: 'chess',
      name: 'Chess',
      icon: Crown,
      color: '#8B5CF6',
      gradient: ['rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0.05)'],
      category: 'traditional',
    },
    {
      id: 'football',
      name: 'Football',
      icon: Circle,
      color: '#10B981',
      gradient: ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.05)'],
      category: 'traditional',
    },
    {
      id: 'basketball',
      name: 'Basketball',
      icon: Circle,
      color: '#F59E0B',
      gradient: ['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.05)'],
      category: 'traditional',
    },
  ];

  const notificationOptions: NotificationOption[] = [
    {
      id: 'clan_challenges',
      name: 'Clan Challenges',
      description: 'Get notified about upcoming clan matches and challenges',
      enabled: notificationSettings.clan_challenges,
    },
    {
      id: 'match_updates',
      name: 'Match Updates',
      description: 'Receive updates about your tournament matches and results',
      enabled: notificationSettings.match_updates,
    },
    {
      id: 'game_invites',
      name: 'Game Invitations',
      description: 'Get notified when someone invites you to join a tournament',
      enabled: notificationSettings.game_invites,
    },
    {
      id: 'achievements',
      name: 'Achievements',
      description: 'Celebrate your accomplishments with achievement notifications',
      enabled: notificationSettings.achievements,
    },
    {
      id: 'system',
      name: 'System Announcements',
      description: 'Important updates and announcements from Matchmaster',
      enabled: notificationSettings.system,
    },
  ];

  const toggleGameSelection = (gameId: string) => {
    const hapticFeedback = () => {
      if (Platform.OS !== 'web') {
        // Haptic feedback would go here for native platforms
      }
    };

    hapticFeedback();

    setSelectedGames(prev => {
      if (prev.includes(gameId)) {
        return prev.filter(id => id !== gameId);
      } else {
        return [...prev, gameId];
      }
    });
  };

  const toggleNotification = (notificationId: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [notificationId]: !prev[notificationId],
    }));
  };

  const animateToNextStep = () => {
    // Animate out current step
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Increment step
      setCurrentStep(prev => prev + 1);
      
      // Reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      
      // Animate in new step
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const savePreferences = async () => {
    try {
      // Save game preferences
      await AsyncStorage.setItem('userGamePreferences', JSON.stringify(selectedGames));
      
      // Save notification settings
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      
      // Mark personalization as completed
      await AsyncStorage.setItem('hasCompletedPersonalization', 'true');
      
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      return false;
    }
  };

  const handleContinue = () => {
    if (currentStep === 0 && selectedGames.length === 0) {
      Alert.alert('Select at least one game', 'Please select at least one game to continue.');
      return;
    }

    if (currentStep < 1) {
      animateToNextStep();
    } else {
      finishPersonalization();
    }
  };

  const finishPersonalization = async () => {
    setIsLoading(true);
    
    const saved = await savePreferences();
    
    if (saved) {
      // Add a small delay for better UX
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 500);
    } else {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to save your preferences. Please try again.');
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    
    try {
      await AsyncStorage.setItem('hasCompletedPersonalization', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error skipping personalization:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to skip. Please try again.');
    }
  };

  const renderGameCard = (game: GameOption, index: number) => {
    const isSelected = selectedGames.includes(game.id);
    const IconComponent = game.icon;

    return (
      <TouchableOpacity
        key={game.id}
        style={[
          styles.gameCard,
          isSelected && [styles.gameCardSelected, { borderColor: game.color }],
          { backgroundColor: isSelected ? game.gradient[0] : 'rgba(255, 255, 255, 0.03)' },
        ]}
        onPress={() => toggleGameSelection(game.id)}
        activeOpacity={0.8}
      >
        {/* Selection indicator */}
        <View style={styles.selectionIndicator}>
          {isSelected ? (
            <CheckCircle2 size={20} color={game.color} />
          ) : (
            <Circle size={20} color="rgba(255, 255, 255, 0.3)" />
          )}
        </View>

        {/* Icon container */}
        <View style={[styles.iconContainer, { backgroundColor: game.gradient[1] }]}>
          <View style={[styles.iconWrapper, { borderColor: game.color }]}>
            <IconComponent size={32} color={game.color} strokeWidth={1.5} />
          </View>
        </View>

        {/* Game name */}
        <Text style={[styles.gameName, isSelected && { color: game.color }]}>
          {game.name}
        </Text>

        {/* Category badge */}
        <View style={[styles.categoryBadge, { backgroundColor: game.gradient[1] }]}>
          <Text style={[styles.categoryText, { color: game.color }]}>
            {game.category === 'esports' ? 'Esports' : 'Traditional'}
          </Text>
        </View>

        {/* Glow effect for selected cards */}
        {isSelected && (
          <View
            style={[
              styles.glowEffect,
              {
                shadowColor: game.color,
                backgroundColor: game.gradient[0],
              },
            ]}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderNotificationOption = (option: NotificationOption) => {
    const isEnabled = notificationSettings[option.id];
    
    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.notificationOption,
          isEnabled && styles.notificationOptionEnabled
        ]}
        onPress={() => toggleNotification(option.id)}
        activeOpacity={0.8}
      >
        <View style={styles.notificationIconContainer}>
          {option.id === 'clan_challenges' && (
            <Swords size={24} color={isEnabled ? colors.primary : colors.textSecondary} />
          )}
          {option.id === 'match_updates' && (
            <Trophy size={24} color={isEnabled ? colors.primary : colors.textSecondary} />
          )}
          {option.id === 'game_invites' && (
            <Gamepad2 size={24} color={isEnabled ? colors.primary : colors.textSecondary} />
          )}
          {option.id === 'achievements' && (
            <Crown size={24} color={isEnabled ? colors.primary : colors.textSecondary} />
          )}
          {option.id === 'system' && (
            <Bell size={24} color={isEnabled ? colors.primary : colors.textSecondary} />
          )}
        </View>
        
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{option.name}</Text>
          <Text style={styles.notificationDescription}>{option.description}</Text>
        </View>
        
        <View style={[
          styles.notificationToggle,
          isEnabled ? styles.notificationToggleEnabled : styles.notificationToggleDisabled
        ]}>
          {isEnabled ? (
            <Bell size={16} color="#FFFFFF" />
          ) : (
            <BellOff size={16} color={colors.textSecondary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const esportsGames = gameOptions.filter(game => game.category === 'esports');
  const traditionalGames = gameOptions.filter(game => game.category === 'traditional');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Grid.xl,
      paddingTop: Grid.lg,
      paddingBottom: Grid.md,
    },
    skipButton: {
      paddingHorizontal: Grid.lg,
      paddingVertical: Grid.sm,
      borderRadius: ComponentSpecs.button.borderRadius,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    skipText: {
      ...Typography.labelMedium,
      color: colors.textSecondary,
    },
    content: {
      flex: 1,
      paddingHorizontal: Grid.xl,
    },
    stepIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: Grid.xl,
    },
    stepDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      marginHorizontal: 4,
    },
    activeStepDot: {
      backgroundColor: colors.primary,
      width: 24,
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: Grid.xxxl,
    },
    title: {
      ...Typography.headlineMedium,
      color: colors.text,
      textAlign: 'center',
      marginBottom: Grid.sm,
    },
    subtitle: {
      ...Typography.bodyLarge,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: Grid.md,
    },
    sparkleIcon: {
      marginBottom: Grid.md,
    },
    sectionContainer: {
      marginBottom: Grid.xxxl,
    },
    sectionTitle: {
      ...Typography.titleMedium,
      color: colors.text,
      marginBottom: Grid.lg,
      paddingLeft: Grid.sm,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: Grid.md,
    },
    gameCard: {
      width: (width - Grid.xl * 2 - Grid.md) / 2,
      borderRadius: ComponentSpecs.card.borderRadius,
      padding: Grid.lg,
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      minHeight: 140,
    },
    gameCardSelected: {
      borderWidth: 2,
      backgroundColor: 'rgba(127, 90, 240, 0.1)',
    },
    selectionIndicator: {
      position: 'absolute',
      top: Grid.sm,
      right: Grid.sm,
      zIndex: 2,
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Grid.md,
      alignSelf: 'center',
    },
    iconWrapper: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 1.5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    gameName: {
      ...Typography.titleSmall,
      color: colors.text,
      textAlign: 'center',
      marginBottom: Grid.sm,
    },
    categoryBadge: {
      alignSelf: 'center',
      paddingHorizontal: Grid.sm,
      paddingVertical: Grid.xs,
      borderRadius: ComponentSpecs.button.borderRadius,
    },
    categoryText: {
      ...Typography.labelSmall,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    glowEffect: {
      position: 'absolute',
      top: -2,
      left: -2,
      right: -2,
      bottom: -2,
      borderRadius: ComponentSpecs.card.borderRadius,
      opacity: 0.3,
      zIndex: -1,
    },
    notificationOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: ComponentSpecs.card.borderRadius,
      padding: Grid.lg,
      marginBottom: Grid.md,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    notificationOptionEnabled: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}10`,
    },
    notificationIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Grid.lg,
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      ...Typography.titleSmall,
      color: colors.text,
      marginBottom: Grid.xs,
    },
    notificationDescription: {
      ...Typography.bodySmall,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    notificationToggle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: Grid.md,
    },
    notificationToggleEnabled: {
      backgroundColor: colors.primary,
    },
    notificationToggleDisabled: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    footer: {
      paddingHorizontal: Grid.xl,
      paddingBottom: Grid.xl,
      paddingTop: Grid.lg,
    },
    selectionCount: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Grid.lg,
      gap: Grid.sm,
    },
    selectionText: {
      ...Typography.bodyMedium,
      color: colors.textSecondary,
    },
    selectionNumber: {
      ...Typography.bodyMedium,
      color: colors.primary,
      fontFamily: 'Inter-Bold',
    },
    continueButton: {
      backgroundColor: colors.primary,
      borderRadius: ComponentSpecs.button.borderRadius,
      paddingVertical: Grid.lg,
      paddingHorizontal: Grid.xl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Grid.sm,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    continueButtonDisabled: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      shadowOpacity: 0,
    },
    continueButtonText: {
      ...Typography.labelLarge,
      color: '#FFFFFF',
    },
    continueButtonTextDisabled: {
      color: 'rgba(255, 255, 255, 0.5)',
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 14, 23, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    decorativeCircle1: {
      position: 'absolute',
      top: -50,
      right: -50,
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: 'rgba(127, 90, 240, 0.03)',
    },
    decorativeCircle2: {
      position: 'absolute',
      bottom: -100,
      left: -100,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: 'rgba(44, 182, 125, 0.02)',
    },
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <View style={styles.titleContainer}>
              <View style={styles.sparkleIcon}>
                <Sparkles size={40} color={colors.primary} />
              </View>
              <Text style={styles.title}>Customize Your Feed</Text>
              <Text style={styles.subtitle}>
                Select your favorite games and sports to see personalized tournaments and matches
              </Text>
            </View>

            {/* Esports Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>🎮 Esports</Text>
              <View style={styles.grid}>
                {esportsGames.map((game, index) => renderGameCard(game, index))}
              </View>
            </View>

            {/* Traditional Sports Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>🏆 Traditional Sports</Text>
              <View style={styles.grid}>
                {traditionalGames.map((game, index) => renderGameCard(game, index))}
              </View>
            </View>
          </>
        );
      case 1:
        return (
          <>
            <View style={styles.titleContainer}>
              <View style={styles.sparkleIcon}>
                <Bell size={40} color={colors.primary} />
              </View>
              <Text style={styles.title}>Notification Preferences</Text>
              <Text style={styles.subtitle}>
                Choose what notifications you want to receive to stay updated on your tournaments and clans
              </Text>
            </View>

            <View style={styles.sectionContainer}>
              {notificationOptions.map(option => renderNotificationOption(option))}
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative background elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />

      {/* Header */}
      <View style={styles.header}>
        <View />
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          disabled={isLoading}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Step indicator */}
      <View style={styles.stepIndicator}>
        {[0, 1].map((step) => (
          <View
            key={step}
            style={[
              styles.stepDot,
              currentStep === step && styles.activeStepDot,
            ]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Grid.xl }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {renderStepContent()}
        </Animated.View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {currentStep === 0 && (
          <View style={styles.selectionCount}>
            <Text style={styles.selectionText}>Selected:</Text>
            <Text style={styles.selectionNumber}>{selectedGames.length}</Text>
            <Text style={styles.selectionText}>
              {selectedGames.length === 1 ? 'game' : 'games'}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.continueButton,
            (currentStep === 0 && selectedGames.length === 0) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={(currentStep === 0 && selectedGames.length === 0) || isLoading}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.continueButtonText,
              (currentStep === 0 && selectedGames.length === 0) && styles.continueButtonTextDisabled,
            ]}
          >
            {currentStep < 1 ? 'Continue' : 'Finish Setup'}
          </Text>
          {!isLoading && <ArrowRight size={20} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            }}
          >
            <Sparkles size={40} color={colors.primary} />
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}