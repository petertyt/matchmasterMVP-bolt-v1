import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  ChevronRight,
  Swords,
  Target,
  Crown
} from 'lucide-react-native';
import { FontSize, Spacing, BorderRadius } from '@/constants/Spacing';

const { width, height } = Dimensions.get('window');

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string[];
}

const slides: SlideData[] = [
  {
    id: 1,
    title: 'Create Epic',
    subtitle: 'Tournaments',
    description: 'Build and manage tournaments with multiple formats. Single elimination, double elimination, or round-robin - the choice is yours.',
    icon: Trophy,
    color: '#7F5AF0',
    gradient: ['rgba(127, 90, 240, 0.2)', 'rgba(127, 90, 240, 0.05)'],
  },
  {
    id: 2,
    title: 'Battle Clan',
    subtitle: 'vs Clan',
    description: 'Form powerful clans with your friends. Compete against other clans and climb the leaderboards together.',
    icon: Swords,
    color: '#2CB67D',
    gradient: ['rgba(44, 182, 125, 0.2)', 'rgba(44, 182, 125, 0.05)'],
  },
  {
    id: 3,
    title: 'Track Your',
    subtitle: 'Stats',
    description: 'Monitor your performance with detailed analytics. See your win rate, tournament history, and achievements.',
    icon: TrendingUp,
    color: '#F59E0B',
    gradient: ['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.05)'],
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

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

  const handleSkip = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.replace('/auth');
    });
  };

  const handleGetStarted = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.replace('/auth');
    });
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
            {index === 0 && (
              <>
                <View style={styles.featureItem}>
                  <Target size={16} color="rgba(255, 255, 255, 0.6)" />
                  <Text style={styles.featureText}>Multiple Formats</Text>
                </View>
                <View style={styles.featureItem}>
                  <Crown size={16} color="rgba(255, 255, 255, 0.6)" />
                  <Text style={styles.featureText}>Prize Management</Text>
                </View>
              </>
            )}
            {index === 1 && (
              <>
                <View style={styles.featureItem}>
                  <Users size={16} color="rgba(255, 255, 255, 0.6)" />
                  <Text style={styles.featureText}>Team Building</Text>
                </View>
                <View style={styles.featureItem}>
                  <Trophy size={16} color="rgba(255, 255, 255, 0.6)" />
                  <Text style={styles.featureText}>Clan Rankings</Text>
                </View>
              </>
            )}
            {index === 2 && (
              <>
                <View style={styles.featureItem}>
                  <TrendingUp size={16} color="rgba(255, 255, 255, 0.6)" />
                  <Text style={styles.featureText}>Performance Analytics</Text>
                </View>
                <View style={styles.featureItem}>
                  <Trophy size={16} color="rgba(255, 255, 255, 0.6)" />
                  <Text style={styles.featureText}>Achievement System</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0F0E17',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
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
    scrollContainer: {
      flex: 1,
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
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
      marginBottom: Spacing.xxxl,
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
      marginBottom: Spacing.xl,
    },
    title: {
      fontSize: FontSize.xxxl,
      fontFamily: 'Poppins-Bold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: Spacing.xs,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: FontSize.xxxl,
      fontFamily: 'Poppins-Bold',
      textAlign: 'center',
      marginBottom: Spacing.lg,
      letterSpacing: 0.5,
    },
    description: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.7)',
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: Spacing.md,
    },
    featuresContainer: {
      flexDirection: 'row',
      gap: Spacing.lg,
      marginTop: Spacing.lg,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: BorderRadius.lg,
    },
    featureText: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-Medium',
      color: 'rgba(255, 255, 255, 0.6)',
    },
    footer: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
      paddingTop: Spacing.lg,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.xl,
      gap: Spacing.sm,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    activeDot: {
      width: 24,
      backgroundColor: '#7F5AF0',
    },
    buttonContainer: {
      alignItems: 'center',
    },
    getStartedButton: {
      backgroundColor: '#7F5AF0',
      paddingHorizontal: Spacing.xxxl,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.xl,
      flexDirection: 'row',
      alignItems: 'center',
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
    getStartedText: {
      fontSize: FontSize.lg,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    navigationDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.sm,
      marginBottom: Spacing.lg,
    },
    navDot: {
      width: 32,
      height: 4,
      borderRadius: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    activeNavDot: {
      backgroundColor: '#7F5AF0',
      width: 40,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header with Skip button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
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
              >
                <Text style={styles.getStartedText}>Get Started</Text>
                <ChevronRight size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}