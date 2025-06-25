import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AuthScreen from '@/screens/AuthScreen';
import { useAuthContext } from '@/components/AuthProvider';
import LoadingState from '@/components/LoadingState';

export default function Auth() {
  const { isAuthenticated, loading } = useAuthContext();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // If already authenticated, redirect to main app
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return <LoadingState message="Checking authentication..." />;
  }

  // Only show auth screen if not authenticated
  return (
    <View style={styles.container}>
      <AuthScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});