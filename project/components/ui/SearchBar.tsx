import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Grid, Typography, ComponentSpecs } from '@/constants/DesignSystem';

const { width } = Dimensions.get('window');

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'suggestion';
  category?: 'tournament' | 'clan' | 'user';
}

interface SearchBarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  isExpanded,
  onToggle,
  onSearchChange,
  placeholder = "Search tournaments, clans...",
}: SearchBarProps) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const searchAnimation = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Start animations sequence
    const toValue = isExpanded ? 1 : 0;
    
    Animated.spring(searchAnimation, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();

    if (isExpanded) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
      onSearchChange('');
    }
  }, [isExpanded]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    onSearchChange(text);
  };

  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.text);
    onSearchChange(suggestion.text);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearchChange('');
    inputRef.current?.focus();
  };

  const searchWidth = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - (Grid.xl * 2)],
  });

  const searchOpacity = searchAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: 60,
      justifyContent: 'center',
      zIndex: isExpanded ? 20 : -1,
    },
    searchContainer: {
      height: 44,
      backgroundColor: colors.surface,
      borderRadius: ComponentSpecs.input.borderRadius,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Grid.md,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    searchInput: {
      flex: 1,
      ...Typography.bodyMedium,
      color: colors.text,
      marginLeft: Grid.sm,
    },
    clearButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: Grid.sm,
    },
    suggestionsContainer: {
      position: 'absolute',
      top: 52,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      borderRadius: ComponentSpecs.card.borderRadius,
      borderWidth: 1,
      borderColor: colors.border,
      maxHeight: 300,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      display: 'none', // Hide suggestions by default
    },
    suggestionsContent: {
      padding: Grid.md,
    },
    sectionTitle: {
      ...Typography.labelLarge,
      color: colors.textSecondary,
      marginBottom: Grid.sm,
      marginTop: Grid.sm,
      textTransform: 'uppercase',
    },
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Grid.md,
      paddingHorizontal: Grid.sm,
      borderRadius: ComponentSpecs.button.borderRadius,
    },
    suggestionIcon: {
      marginRight: Grid.md,
    },
    suggestionText: {
      ...Typography.bodyMedium,
      color: colors.text,
      flex: 1,
    },
    suggestionCategory: {
      ...Typography.labelSmall,
      color: colors.textSecondary,
      textTransform: 'capitalize',
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: Grid.sm,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: Grid.xl,
    },
    emptyStateText: {
      ...Typography.bodyMedium,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  if (!isExpanded) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: searchWidth,
          opacity: searchOpacity,
        },
      ]}
    >
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearchChange}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 ? (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <X size={14} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onToggle}>
            <X size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}