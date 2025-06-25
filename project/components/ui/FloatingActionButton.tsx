import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { BorderRadius } from '@/constants/Spacing';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: React.ReactNode;
  size?: number;
  bottom?: number;
  right?: number;
  visible?: boolean;
}

export default function FloatingActionButton({
  onPress,
  icon,
  size = 56,
  bottom = 24,
  right = 24,
  visible = true,
}: FloatingActionButtonProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [visible, scaleAnim]);

  const handlePress = () => {
    // Rotation animation on press
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: bottom + (Platform.OS === 'ios' ? 88 : 68), // Above tab bar
      right,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8, // Android shadow
      shadowColor: colors.primary, // iOS shadow
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      zIndex: 1000,
    },
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { scale: scaleAnim },
            { rotate },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: size / 2,
        }}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {icon || <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />}
      </TouchableOpacity>
    </Animated.View>
  );
}