import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuthContext } from '@/components/AuthProvider';
import { useTheme } from '@/hooks/useTheme';
import { Grid, Typography } from '@/constants/DesignSystem';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogoutScreen() {
  const { signOut } = useAuthContext();
  const { colors } = useTheme();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Clear any stored user preferences or settings
        await AsyncStorage.multiRemove([
          'userGamePreferences',
          'lastViewedTournament',
          'recentSearches',
          'notificationSettings'
        ]);

        // Sign out from Supabase
        const result = await signOut();
        
        if (!result.success) {
          console.error('Error signing out:', result.error);
          // Force navigation to auth screen even if there's an error
          router.replace('/auth');
        }
        
        // Don't navigate here - let the AuthProvider handle navigation
      } catch (error) {
        console.error('Error during logout:', error);
        // Still redirect to auth screen even if there's an error
        router.replace('/auth');
      }
    };

    // Small delay to show the loading state
    const timer = setTimeout(() => {
      performLogout();
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: Grid.xl,
    },
    loadingText: {
      ...Typography.bodyLarge,
      color: colors.textSecondary,
      marginTop: Grid.lg,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Signing you out...</Text>
    </View>
  );
}