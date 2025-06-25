import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Spacing } from '@/constants/Spacing';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
}

export default function LoadingState({ 
  message = 'Loading...', 
  size = 'large' 
}: LoadingStateProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: Spacing.xl,
    },
    loadingText: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginTop: Spacing.md,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}