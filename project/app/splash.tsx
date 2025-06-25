import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Trophy } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Spacing } from '@/constants/Spacing';
import { useAuthContext } from '@/components/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { colors } = useTheme();
  const { isAuthenticated, loading } = useAuthContext();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations sequence
    const animationSequence = Animated.sequence([
      // Logo fade in and scale up
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Text fade in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Loading indicator fade in
      Animated.timing(loadingOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]);

    animationSequence.start();

    // Navigate after delay, but only if auth is not still loading
    const navigationTimer = setTimeout(async () => {
      if (!loading) {
        try {
          // Check if user has seen onboarding
          const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
          
          if (hasSeenOnboarding !== 'true') {
            // First time user, show onboarding
            router.replace('/onboarding');
          } else if (isAuthenticated) {
            // Check if user has completed personalization
            const hasCompletedPersonalization = await AsyncStorage.getItem('hasCompletedPersonalization');
            
            if (hasCompletedPersonalization === 'true') {
              // User has completed personalization, go to main app
              router.replace('/(tabs)');
            } else {
              // User needs to complete personalization
              router.replace('/personalization');
            }
          } else {
            // User not authenticated, go to auth
            router.replace('/auth');
          }
        } catch (error) {
          console.error('Navigation error:', error);
          // Fallback navigation
          router.push(isAuthenticated ? '/(tabs)' : '/onboarding');
        }
      }
    }, 2500);

    // Cleanup function
    return () => {
      clearTimeout(navigationTimer);
      logoOpacity.removeAllListeners();
      logoScale.removeAllListeners();
      textOpacity.removeAllListeners();
      loadingOpacity.removeAllListeners();
    };
  }, [logoOpacity, logoScale, textOpacity, loadingOpacity, isAuthenticated, loading]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0F0E17',
      justifyContent: 'center',
      alignItems: 'center',
      width,
      height,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: Spacing.xxxl,
    },
    logoWrapper: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(127, 90, 240, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.xl,
      borderWidth: 2,
      borderColor: 'rgba(127, 90, 240, 0.3)',
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    title: {
      fontSize: FontSize.xxxxl,
      fontFamily: 'Poppins-Bold',
      color: '#FFFFFF',
      textAlign: 'center',
      letterSpacing: 1,
    },
    subtitle: {
      fontSize: FontSize.lg,
      fontFamily: 'Inter-Medium',
      color: 'rgba(255, 255, 255, 0.7)',
      textAlign: 'center',
      marginTop: Spacing.sm,
      letterSpacing: 0.5,
    },
    loadingContainer: {
      position: 'absolute',
      bottom: 100,
      alignItems: 'center',
    },
    loadingText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.6)',
      marginTop: Spacing.md,
    },
    backgroundGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.1,
    },
    decorativeCircle1: {
      position: 'absolute',
      top: -50,
      right: -50,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: 'rgba(127, 90, 240, 0.05)',
    },
    decorativeCircle2: {
      position: 'absolute',
      bottom: -100,
      left: -100,
      width: 300,
      height: 300,
      borderRadius: 150,
      backgroundColor: 'rgba(44, 182, 125, 0.03)',
    },
  });

  return (
    <View style={styles.container}>
      {/* Decorative background elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      
      {/* Main content */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logoWrapper}>
          <Trophy size={60} color="#7F5AF0" strokeWidth={2} />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: textOpacity,
          },
        ]}
      >
        <Text style={styles.title}>Matchmaster</Text>
        <Text style={styles.subtitle}>Tournament Management</Text>
      </Animated.View>

      {/* Loading indicator */}
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: loadingOpacity,
          },
        ]}
      >
        <ActivityIndicator size="large" color="#7F5AF0" />
        <Text style={styles.loadingText}>Loading your tournaments...</Text>
      </Animated.View>
    </View>
  );
}