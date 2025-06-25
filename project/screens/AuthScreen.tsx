import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CircleAlert as AlertCircle, Chrome } from 'lucide-react-native';
import { useAuthContext } from '@/components/AuthProvider';
import { useTheme } from '@/hooks/useTheme';
import { Grid, Typography, ComponentSpecs } from '@/constants/DesignSystem';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function AuthScreen() {
  const { colors } = useTheme();
  const { signIn, signUp, loading } = useAuthContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
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
    ]).start();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation (only for signup)
    if (!isLogin) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // For web, you would implement OAuth flow here
      // For now, we'll show a placeholder
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('Coming Soon', 'Google authentication will be available soon!');
      }, 1000);
    } catch (error: any) {
      setErrors({ general: error.message || 'Google authentication failed' });
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, username);
      }

      if (result.success) {
        // Navigation will be handled by the AuthProvider
      } else {
        const errorMessage = result.error || 'Authentication failed';
        setErrors({ general: errorMessage });
        
        // Show alert to make error more prominent
        Alert.alert(
          isLogin ? 'Sign In Failed' : 'Sign Up Failed',
          errorMessage,
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Authentication failed';
      setErrors({ general: errorMessage });
      
      // Show alert to make error more prominent
      Alert.alert(
        'Authentication Error',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setPassword('');
    setConfirmPassword('');
    setUsername('');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: Grid.xl,
      paddingVertical: Grid.xxxl,
      justifyContent: 'center',
      minHeight: '100%',
    },
    header: {
      alignItems: 'center',
      marginBottom: Grid.xxxxl,
    },
    title: {
      ...Typography.displaySmall,
      color: colors.text,
      textAlign: 'center',
      marginBottom: Grid.sm,
    },
    subtitle: {
      ...Typography.bodyLarge,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    formContainer: {
      marginBottom: Grid.xl,
    },
    googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: ComponentSpecs.button.borderRadius,
      paddingVertical: Grid.lg,
      paddingHorizontal: Grid.xl,
      marginBottom: Grid.xl,
      gap: Grid.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    googleButtonText: {
      ...Typography.labelLarge,
      color: '#1F2937',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: Grid.xl,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      ...Typography.labelMedium,
      color: colors.textSecondary,
      paddingHorizontal: Grid.lg,
    },
    inputContainer: {
      marginBottom: Grid.lg,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: ComponentSpecs.input.borderRadius,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: Grid.lg,
      paddingVertical: Grid.md,
    },
    inputWrapperFocused: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}05`,
    },
    inputWrapperError: {
      borderColor: colors.error,
      backgroundColor: `${colors.error}05`,
    },
    input: {
      flex: 1,
      marginLeft: Grid.sm,
      ...Typography.bodyMedium,
      color: colors.text,
    },
    eyeButton: {
      padding: Grid.xs,
    },
    errorText: {
      ...Typography.bodySmall,
      color: colors.error,
      marginTop: Grid.xs,
      marginLeft: Grid.sm,
    },
    generalError: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: `${colors.error}10`,
      borderRadius: ComponentSpecs.button.borderRadius,
      padding: Grid.md,
      marginBottom: Grid.lg,
      gap: Grid.sm,
    },
    generalErrorText: {
      ...Typography.bodyMedium,
      color: colors.error,
      flex: 1,
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: ComponentSpecs.button.borderRadius,
      paddingVertical: Grid.lg,
      paddingHorizontal: Grid.xl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Grid.sm,
      marginTop: Grid.lg,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      ...Typography.labelLarge,
      color: '#FFFFFF',
    },
    footer: {
      alignItems: 'center',
      marginTop: Grid.xl,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    switchText: {
      ...Typography.bodyMedium,
      color: colors.textSecondary,
    },
    switchButton: {
      marginLeft: Grid.xs,
    },
    switchButtonText: {
      ...Typography.labelLarge,
      color: colors.primary,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {isLogin ? 'Welcome Back' : 'Join Matchmaster'}
              </Text>
              <Text style={styles.subtitle}>
                {isLogin
                  ? 'Sign in to continue your tournament journey'
                  : 'Create your account and start competing'}
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* General Error */}
              {errors.general && (
                <View style={styles.generalError}>
                  <AlertCircle size={20} color={colors.error} />
                  <Text style={styles.generalErrorText}>{errors.general}</Text>
                </View>
              )}

              {/* Google Auth Button */}
              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleAuth}
                disabled={isLoading || loading}
                activeOpacity={0.8}
              >
                <Chrome size={20} color="#1F2937" />
                <Text style={styles.googleButtonText}>
                  Continue with Google
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Username Input (Sign Up only) */}
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.email && styles.inputWrapperError,
                    ]}
                  >
                    <User size={20} color={colors.textSecondary} />
                    <TextInput
                      style={styles.input}
                      placeholder="Username (optional)"
                      placeholderTextColor={colors.textSecondary}
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      autoComplete="username"
                    />
                  </View>
                </View>
              )}

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.email && styles.inputWrapperError,
                  ]}
                >
                  <Mail size={20} color={colors.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor={colors.textSecondary}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) {
                        setErrors({ ...errors, email: undefined });
                      }
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.password && styles.inputWrapperError,
                  ]}
                >
                  <Lock size={20} color={colors.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) {
                        setErrors({ ...errors, password: undefined });
                      }
                    }}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              {/* Confirm Password Input (Sign Up only) */}
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.confirmPassword && styles.inputWrapperError,
                    ]}
                  >
                    <Lock size={20} color={colors.textSecondary} />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm password"
                      placeholderTextColor={colors.textSecondary}
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        if (errors.confirmPassword) {
                          setErrors({ ...errors, confirmPassword: undefined });
                        }
                      }}
                      secureTextEntry={!showConfirmPassword}
                      autoComplete="password"
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} color={colors.textSecondary} />
                      ) : (
                        <Eye size={20} color={colors.textSecondary} />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  )}
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (isLoading || loading) && styles.submitButtonDisabled,
                ]}
                onPress={handleEmailAuth}
                disabled={isLoading || loading}
                activeOpacity={0.8}
              >
                {isLoading || loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>
                      {isLogin ? 'Sign In' : 'Create Account'}
                    </Text>
                    <ArrowRight size={20} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                </Text>
                <TouchableOpacity
                  style={styles.switchButton}
                  onPress={toggleMode}
                  disabled={isLoading || loading}
                >
                  <Text style={styles.switchButtonText}>
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}