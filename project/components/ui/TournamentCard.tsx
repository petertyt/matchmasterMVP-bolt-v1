import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Users, Calendar, Crown, Play, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Spacing, BorderRadius } from '@/constants/Spacing';

interface Tournament {
  id: string;
  title: string;
  participants: number;
  maxParticipants: number;
  status: 'upcoming' | 'registration' | 'active' | 'completed';
  format: string;
  prize: string;
  startDate: string;
  image: string;
  progress?: number;
}

interface TournamentCardProps {
  tournament: Tournament;
  onPress: (tournament: Tournament) => void;
  variant?: 'default' | 'compact' | 'featured';
}

export default function TournamentCard({
  tournament,
  onPress,
  variant = 'default',
}: TournamentCardProps) {
  const { colors } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registration':
        return colors.accent;
      case 'active':
        return colors.error;
      case 'upcoming':
        return colors.primary;
      case 'completed':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'registration':
        return <Users size={12} color="#FFFFFF" />;
      case 'active':
        return <Play size={12} color="#FFFFFF" />;
      case 'upcoming':
        return <Clock size={12} color="#FFFFFF" />;
      case 'completed':
        return <CheckCircle size={12} color="#FFFFFF" />;
      default:
        return <Clock size={12} color="#FFFFFF" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'registration':
        return 'Open';
      case 'active':
        return 'Live';
      case 'upcoming':
        return 'Soon';
      case 'completed':
        return 'Done';
      default:
        return status;
    }
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.md,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      ...(variant === 'featured' && {
        borderColor: colors.primary,
        borderWidth: 2,
      }),
    },
    imageContainer: {
      height: variant === 'compact' ? 80 : 120,
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    statusBadge: {
      position: 'absolute',
      top: Spacing.sm,
      right: Spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
      gap: 4,
    },
    statusText: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      textTransform: 'uppercase',
    },
    content: {
      padding: Spacing.lg,
    },
    header: {
      marginBottom: Spacing.sm,
    },
    title: {
      fontSize: variant === 'compact' ? FontSize.base : FontSize.lg,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
      marginBottom: Spacing.xs,
      lineHeight: variant === 'compact' ? 20 : 24,
    },
    subtitle: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 18,
    },
    meta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: variant === 'compact' ? 0 : Spacing.sm,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    metaText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    progressContainer: {
      marginTop: Spacing.sm,
    },
    progressBar: {
      height: 4,
      backgroundColor: colors.surface,
      borderRadius: 2,
      overflow: 'hidden',
      marginBottom: Spacing.xs,
    },
    progressFill: {
      height: '100%',
      borderRadius: 2,
    },
    progressText: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    featuredBadge: {
      position: 'absolute',
      top: Spacing.sm,
      left: Spacing.sm,
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
    },
    featuredText: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      textTransform: 'uppercase',
    },
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(tournament)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: tournament.image }} style={styles.image} />
        <View style={styles.imageOverlay} />
        
        {variant === 'featured' && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tournament.status) }]}>
          {getStatusIcon(tournament.status)}
          <Text style={styles.statusText}>{getStatusText(tournament.status)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={variant === 'compact' ? 1 : 2}>
            {tournament.title}
          </Text>
          <Text style={styles.subtitle}>{tournament.format}</Text>
        </View>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Users size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              {tournament.participants}/{tournament.maxParticipants}
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <Calendar size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{tournament.startDate}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Crown size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{tournament.prize}</Text>
          </View>
        </View>

        {tournament.progress !== undefined && variant !== 'compact' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${tournament.progress}%`,
                    backgroundColor: getStatusColor(tournament.status),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{tournament.progress}% Complete</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}