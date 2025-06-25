import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gamepad2, Target, Zap, Trophy, Crown, Swords, Circle, CircleCheck as CheckCircle2, ArrowRight, Sparkles } from 'lucide-react-native';
import { FontSize, Spacing, BorderRadius } from '@/constants/Spacing';

const { width } = Dimensions.get('window');

interface GameOption {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string[];
  category: 'esports' | 'traditional';
}

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
  {
    id: 'tennis',
    name: 'Tennis',
    icon: Circle,
    color: '#06B6D4',
    gradient: ['rgba(6, 182, 212, 0.2)', 'rgba(6, 182, 212, 0.05)'],
    category: 'traditional',
  },
  {
    id: 'darts',
    name: 'Darts',
    icon: Target,
    color: '#EF4444',
    gradient: ['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.05)'],
    category: 'traditional',
  },
];

export default function PersonalizationScreen() {
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnims = useRef(gameOptions.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Stagger card animations
    const cardAnimations = cardAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      })
    );

    Animated.stagger(50, cardAnimations).start();
  }, []);

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

  const savePreferences = async () => {
    try {
      await AsyncStorage.setItem('userGamePreferences', JSON.stringify(selectedGames));
      await AsyncStorage.setItem('hasCompletedPersonalization', 'true');
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      return false;
    }
  };

  const handleContinue = async () => {
    if (selectedGames.length === 0) {
      // Could show a toast or alert here
      return;
    }

    setIsLoading(true);
    
    const saved = await savePreferences();
    
    if (saved) {
      // Add a small delay for better UX
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 300);
    } else {
      setIsLoading(false);
      // Handle error - could show an error message
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
    }
  };

  const renderGameCard = (game: GameOption, index: number) => {
    const isSelected = selectedGames.includes(game.id);
    const IconComponent = game.icon;
    const cardAnim = cardAnims[index];

    return (
      <Animated.View
        key={game.id}
        style={[
          styles.cardContainer,
          {
            opacity: cardAnim,
            transform: [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
              {
                scale: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
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
      </Animated.View>
    );
  };

  const esportsGames = gameOptions.filter(game => game.category === 'esports');
  const traditionalGames = gameOptions.filter(game => game.category === 'traditional');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0F0E17',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.md,
    },
    skipButton: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    skipText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
      color: 'rgba(255, 255, 255, 0.8)',
    },
    content: {
      flex: 1,
      paddingHorizontal: Spacing.xl,
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: Spacing.xxxxl,
    },
    title: {
      fontSize: FontSize.xxxl,
      fontFamily: 'Poppins-Bold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: Spacing.sm,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.7)',
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: Spacing.md,
    },
    sparkleIcon: {
      marginBottom: Spacing.md,
    },
    sectionContainer: {
      marginBottom: Spacing.xxxl,
    },
    sectionTitle: {
      fontSize: FontSize.lg,
      fontFamily: 'Poppins-SemiBold',
      color: '#FFFFFF',
      marginBottom: Spacing.lg,
      paddingLeft: Spacing.sm,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: Spacing.md,
    },
    cardContainer: {
      width: (width - Spacing.xl * 2 - Spacing.md) / 2,
      marginBottom: Spacing.md,
    },
    gameCard: {
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
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
      top: Spacing.sm,
      right: Spacing.sm,
      zIndex: 2,
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
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
      fontSize: FontSize.base,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: Spacing.sm,
    },
    categoryBadge: {
      alignSelf: 'center',
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
    },
    categoryText: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-Medium',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    glowEffect: {
      position: 'absolute',
      top: -2,
      left: -2,
      right: -2,
      bottom: -2,
      borderRadius: BorderRadius.lg,
      opacity: 0.3,
      zIndex: -1,
    },
    footer: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
      paddingTop: Spacing.lg,
    },
    selectionCount: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.lg,
      gap: Spacing.sm,
    },
    selectionText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    selectionNumber: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Bold',
      color: '#7F5AF0',
    },
    continueButton: {
      backgroundColor: '#7F5AF0',
      borderRadius: BorderRadius.lg,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.xl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
      shadowColor: '#7F5AF0',
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
      fontSize: FontSize.base,
      fontFamily: 'Inter-SemiBold',
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

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing.xl }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Title Section */}
          <View style={styles.titleContainer}>
            <View style={styles.sparkleIcon}>
              <Sparkles size={40} color="#7F5AF0" />
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
              {traditionalGames.map((game, index) => renderGameCard(game, index + esportsGames.length))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Selection count */}
        <View style={styles.selectionCount}>
          <Text style={styles.selectionText}>Selected:</Text>
          <Text style={styles.selectionNumber}>{selectedGames.length}</Text>
          <Text style={styles.selectionText}>
            {selectedGames.length === 1 ? 'game' : 'games'}
          </Text>
        </View>

        {/* Continue button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedGames.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedGames.length === 0 || isLoading}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.continueButtonText,
              selectedGames.length === 0 && styles.continueButtonTextDisabled,
            ]}
          >
            {isLoading ? 'Setting up...' : 'Continue'}
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
            <Sparkles size={40} color="#7F5AF0" />
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}