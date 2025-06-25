import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Users, Star, TrendingUp, Crown, Shield } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Spacing, BorderRadius } from '@/constants/Spacing';

interface Clan {
  id: string;
  name: string;
  tag: string;
  members: number;
  maxMembers: number;
  level: number;
  wins: number;
  rank: number;
  leader: string;
  logo: string;
  isJoined?: boolean;
  isPublic?: boolean;
}

interface ClanCardProps {
  clan: Clan;
  onPress: (clan: Clan) => void;
  onJoin?: (clan: Clan) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

export default function ClanCard({
  clan,
  onPress,
  onJoin,
  variant = 'default',
}: ClanCardProps) {
  const { colors } = useTheme();

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#FFD700'; // Gold
    if (rank === 2) return '#C0C0C0'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    return colors.textSecondary;
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return <Crown size={14} color={getRankColor(rank)} />;
    return <Shield size={14} color={colors.textSecondary} />;
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: clan.isJoined ? colors.primary : colors.border,
      ...(clan.isJoined && {
        backgroundColor: `${colors.primary}10`,
      }),
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: variant === 'compact' ? 0 : Spacing.md,
    },
    clanInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: Spacing.sm,
    },
    logo: {
      fontSize: variant === 'compact' ? FontSize.lg : FontSize.xl,
      marginRight: Spacing.sm,
    },
    details: {
      flex: 1,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    name: {
      fontSize: variant === 'compact' ? FontSize.base : FontSize.lg,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
      marginRight: Spacing.xs,
    },
    tag: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
    },
    rankRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      marginBottom: variant === 'detailed' ? Spacing.xs : 0,
    },
    rankText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    leader: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    actionButton: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      minWidth: 60,
      alignItems: 'center',
    },
    joinButton: {
      backgroundColor: colors.accent,
    },
    joinedButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    privateButton: {
      backgroundColor: colors.surface,
    },
    buttonText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
    },
    joinButtonText: {
      color: '#FFFFFF',
    },
    joinedButtonText: {
      color: colors.primary,
    },
    privateButtonText: {
      color: colors.textSecondary,
    },
    meta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
    memberBadge: {
      position: 'absolute',
      top: Spacing.sm,
      right: Spacing.sm,
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
    },
    memberBadgeText: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
  });

  const handleActionPress = () => {
    if (clan.isJoined) {
      onPress(clan);
    } else if (onJoin && clan.isPublic) {
      onJoin(clan);
    }
  };

  const getButtonConfig = () => {
    if (clan.isJoined) {
      return {
        style: styles.joinedButton,
        textStyle: styles.joinedButtonText,
        text: 'Manage',
      };
    }
    if (!clan.isPublic) {
      return {
        style: styles.privateButton,
        textStyle: styles.privateButtonText,
        text: 'Private',
      };
    }
    return {
      style: styles.joinButton,
      textStyle: styles.joinButtonText,
      text: 'Join',
    };
  };

  const buttonConfig = getButtonConfig();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(clan)}
      activeOpacity={0.8}
    >
      {clan.isJoined && (
        <View style={styles.memberBadge}>
          <Text style={styles.memberBadgeText}>Your Clan</Text>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.clanInfo}>
          <Text style={styles.logo}>{clan.logo}</Text>
          <View style={styles.details}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {clan.name}
              </Text>
              <Text style={styles.tag}>[{clan.tag}]</Text>
            </View>
            <View style={styles.rankRow}>
              {getRankIcon(clan.rank)}
              <Text style={styles.rankText}>#{clan.rank}</Text>
              {variant === 'detailed' && (
                <Text style={styles.leader}>• {clan.leader}</Text>
              )}
            </View>
            {variant !== 'detailed' && (
              <Text style={styles.leader}>Leader: {clan.leader}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, buttonConfig.style]}
          onPress={handleActionPress}
          disabled={!clan.isPublic && !clan.isJoined}
        >
          <Text style={[styles.buttonText, buttonConfig.textStyle]}>
            {buttonConfig.text}
          </Text>
        </TouchableOpacity>
      </View>

      {variant !== 'compact' && (
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Users size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              {clan.members}/{clan.maxMembers}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Star size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>Level {clan.level}</Text>
          </View>
          <View style={styles.metaItem}>
            <TrendingUp size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{clan.wins} wins</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}