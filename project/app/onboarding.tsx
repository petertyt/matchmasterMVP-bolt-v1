import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  ChevronRight,
  Swords,
  Target,
  Crown,
  Sparkles,
  Shield,
  Zap
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Grid, Typography, ComponentSpecs } from '@/constants/DesignSystem';

const { width, height } = Dimensions.get('window');

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string[];
  features: Array<{
    icon: React.ComponentType<any>;
    text: string;
  }>;
}

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Check if user has seen onboarding before
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        if (hasSeenOnboarding === 'true') {
          // User has already seen onboarding, go to auth
          router.replace('/auth');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };

    checkOnboardingStatus();
  }, []);

  const slides: SlideData[] = [
    {
      id: 1,
      title: 'Create Epic',
      subtitle: 'Tournaments',
      description: 'Build and manage tournaments with multiple formats. Single elimination, double elimination, or round-robin - the choice is yours.',
      icon: Trophy,
      color: '#7F5AF0',
      gradient: ['rgba(127, 90, 240, 0.2)', 'rgba(127, 90, 240, 0.05)'],
      features: [
        { icon: Target, text: 'Multiple Formats' },
        { icon: Crown, text: 'Prize Management' },
      ],
    },
    {
      id: 2,
      title: 'Battle Clan',
      subtitle: 'vs Clan',
      description: 'Form powerful clans with your friends. Compete against other clans and climb the leaderboards together.',
      icon: Swords,
      color: '#2CB67D',
      gradient: ['rgba(44, 182, 125, 0.2)', 'rgba(44, 182, 125, 0.05)'],
      features: [
        { icon: Users, text: 'Team Building' },
        { icon: Shield, text: 'Clan Rankings' },
      ],
    },
    {
      id: 3,
      title: 'Track Your',
      subtitle: 'Stats',
      description: 'Monitor your performance with detailed analytics. See your win rate, tournament history, and achievements.',
      icon: TrendingUp,
      color: '#F59E0B',
      gradient: ['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.05)'],
      features: [
        { icon: Zap, text: 'Performance Analytics' },
        { icon: Trophy, text: 'Achievement System' },
      ],
    },
  ];

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const goToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
    setCurrentIndex(index);
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        router.replace('/auth');
      });
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/auth');
    }
  };

  const handleGetStarted = async () => {
    setIsLoading(true);
    
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        router.replace('/auth');
      });
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      setIsLoading(false);
      router.replace('/auth');
    }
  };

  const renderSlide = (slide: SlideData, index: number) => {
    const IconComponent = slide.icon;
    
    return (
      <View key={slide.id} style={[styles.slide, { width }]}>
        <View style={styles.slideContent}>
          {/* Icon Container */}
          <View style={[styles.iconContainer, { backgroundColor: slide.gradient[0] }]}>
            <View style={[styles.iconWrapper, { borderColor: slide.color }]}>
              <IconComponent size={80} color={slide.color} strokeWidth={1.5} />
            </View>
            
            {/* Decorative elements */}
            <View style={[styles.decorativeRing, { borderColor: slide.color }]} />
            <View style={[styles.decorativeRing2, { borderColor: slide.color }]} />
          </View>

          {/* Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={[styles.subtitle, { color: slide.color }]}>{slide.subtitle}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>

          {/* Feature highlights */}
          <View style={styles.featuresContainer}>
            {slide.features.map((feature, featureIndex) => (
              <View key={featureIndex} style={styles.featureItem}>
                <feature.icon size={16} color={slide.color} />
                <Text style={[styles.featureText, { color: slide.color }]}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
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
    scrollContainer: {
      flex: 1,
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Grid.xl,
    },
    slideContent: {
      alignItems: 'center',
      maxWidth: 320,
    },
    iconContainer: {
      width: 200,
      height: 200,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Grid.xxxl,
      position: 'relative',
    },
    iconWrapper: {
      width: 140,
      height: 140,
      borderRadius: 70,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    decorativeRing: {
      position: 'absolute',
      width: 180,
      height: 180,
      borderRadius: 90,
      borderWidth: 1,
      opacity: 0.3,
    },
    decorativeRing2: {
      position: 'absolute',
      width: 220,
      height: 220,
      borderRadius: 110,
      borderWidth: 1,
      opacity: 0.1,
    },
    textContainer: {
      alignItems: 'center',
      marginBottom: Grid.xl,
    },
    title: {
      ...Typography.displaySmall,
      color: colors.text,
      textAlign: 'center',
      marginBottom: Grid.xs,
      letterSpacing: 0.5,
    },
    subtitle: {
      ...Typography.displaySmall,
      textAlign: 'center',
      marginBottom: Grid.lg,
      letterSpacing: 0.5,
    },
    description: {
      ...Typography.bodyLarge,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: Grid.md,
    },
    featuresContainer: {
      flexDirection: 'row',
      gap: Grid.lg,
      marginTop: Grid.lg,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Grid.xs,
      paddingHorizontal: Grid.md,
      paddingVertical: Grid.sm,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: ComponentSpecs.button.borderRadius,
    },
    featureText: {
      ...Typography.labelMedium,
    },
    footer: {
      paddingHorizontal: Grid.xl,
      paddingBottom: Grid.xl,
      paddingTop: Grid.lg,
    },
    navigationDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: Grid.sm,
      marginBottom: Grid.lg,
    },
    navDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    activeNavDot: {
      backgroundColor: colors.primary,
      width: 24,
    },
    buttonContainer: {
      alignItems: 'center',
    },
    getStartedButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: Grid.xxxl,
      paddingVertical: Grid.lg,
      borderRadius: ComponentSpecs.button.borderRadius,
      flexDirection: 'row',
      alignItems: 'center',
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
    getStartedText: {
      ...Typography.labelLarge,
      color: '#FFFFFF',
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
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header with Skip button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={handleSkip}
            disabled={isLoading}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Slides */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollContainer}
        >
          {slides.map((slide, index) => renderSlide(slide, index))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {/* Navigation dots */}
          <View style={styles.navigationDots}>
            {slides.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.navDot,
                  currentIndex === index && styles.activeNavDot,
                ]}
                onPress={() => goToSlide(index)}
              />
            ))}
          </View>

          {/* Get Started button (only on last slide) */}
          {currentIndex === slides.length - 1 && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.getStartedButton}
                onPress={handleGetStarted}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <Text style={styles.getStartedText}>Get Started</Text>
                <ChevronRight size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
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
      </Animated.View>
    </SafeAreaView>
  );
}