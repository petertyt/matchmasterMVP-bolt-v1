import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleAlert as AlertCircle, RefreshCw } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Spacing, BorderRadius } from '@/constants/Spacing';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export default function ErrorState({ 
  title = 'Something went wrong',
  message,
  onRetry,
  retryText = 'Try Again'
}: ErrorStateProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: Spacing.xl,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    title: {
      fontSize: FontSize.lg,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
      marginBottom: Spacing.sm,
      textAlign: 'center',
    },
    message: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: Spacing.xl,
    },
    retryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      gap: Spacing.sm,
    },
    retryButtonText: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <AlertCircle size={40} color="#EF4444" />
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <RefreshCw size={20} color="#FFFFFF" />
          <Text style={styles.retryButtonText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}