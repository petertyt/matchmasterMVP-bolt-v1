import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, 
  User, 
  Trophy, 
  Users, 
  Clock, 
  Play, 
  Target,
  Crown,
  TrendingUp,
  ChevronRight,
  Zap,
  Calendar,
  Star,
  Flame
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuthContext } from '@/components/AuthProvider';
import { useTournaments } from '@/hooks/useTournaments';
import { Grid, Typography, ComponentSpecs } from '@/constants/DesignSystem';
import Header from '@/components/ui/Header';
import TournamentCard from '@/components/ui/TournamentCard';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user, userProfile, isAuthenticated } = useAuthContext();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Mock tournaments data for testing
  const [myTournaments] = useState([
    {
      id: '1',
      name: 'Championship League 2025',
      format: 'single_elimination',
      status: 'active',
      participants: ['user1', 'user2', 'user3'],
      max_participants: 16,
      start_date: '2025-01-20T14:00:00Z',
      prize_pool: '$500',
      image_url: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
    },
    {
      id: '2',
      name: 'Winter Cup',
      format: 'double_elimination',
      status: 'upcoming',
      participants: ['user1'],
      max_participants: 8,
      start_date: '2025-01-25T16:00:00Z',
      prize_pool: '$200',
      image_url: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg',
    }
  ]);

  const [trendingTournaments] = useState([
    {
      id: '3',
      name: 'Elite Championship',
      format: 'round_robin',
      status: 'registration',
      participants: [],
      max_participants: 12,
      start_date: '2025-02-01T18:00:00Z',
      prize_pool: '$1000',
      image_url: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
      featured: true,
    },
    {
      id: '4',
      name: 'Spring Showdown',
      format: 'single_elimination',
      status: 'registration',
      participants: [],
      max_participants: 32,
      start_date: '2025-02-15T20:00:00Z',
      prize_pool: '$750',
      image_url: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg',
    }
  ]);

  // Mock clan challenge data
  const hasUserClan = userProfile?.clan_id;
  const clanChallenge = hasUserClan ? {
    id: '1',
    matchName: 'Thunder Bolts vs Phoenix Rising',
    opponent: 'Phoenix Rising',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    clanName: 'Thunder Bolts',
  } : null;

  useEffect(() => {
    // Start entrance animations
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

    // Update time every minute for countdown
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleTournamentPress = (tournament: any) => {
    console.log('Navigate to tournament:', tournament.id);
    // router.push(`/tournament/${tournament.id}`);
  };

  const handleSeeAllTournaments = () => {
    router.push('/(tabs)/tournaments');
  };

  const handleClanChallengePress = () => {
    console.log('Navigate to clan challenge match');
    // router.push(`/match/${clanChallenge.id}`);
  };

  const getTimeUntilMatch = (startTime: Date): string => {
    const now = currentTime;
    const diff = startTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Starting now!';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const renderTournamentCard = (tournament: any, index: number) => {
    // Convert to TournamentCard format
    const cardTournament = {
      id: tournament.id,
      title: tournament.name,
      participants: tournament.participants?.length || 0,
      maxParticipants: tournament.max_participants,
      status: tournament.status as any,
      format: tournament.format,
      prize: tournament.prize_pool || 'No prize',
      startDate: tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : 'TBD',
      image: tournament.image_url || 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
      progress: tournament.status === 'active' ? 65 : undefined,
    };

    return (
      <View key={tournament.id} style={[styles.tournamentCard, index === 0 && styles.firstCard]}>
        <TournamentCard
          tournament={cardTournament}
          onPress={() => handleTournamentPress(tournament)}
          variant={index === 0 ? 'featured' : 'compact'}
        />
      </View>
    );
  };

  const renderTrendingCard = (tournament: any) => (
    <TouchableOpacity
      key={tournament.id}
      style={[
        styles.trendingCard,
        tournament.featured && styles.featuredCard,
      ]}
      activeOpacity={0.8}
      onPress={() => handleTournamentPress(tournament)}
    >
      <Image 
        source={{ uri: tournament.image_url || 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg' }} 
        style={styles.trendingImage} 
      />
      
      <View style={styles.trendingContent}>
        <View style={styles.trendingHeader}>
          <View style={styles.trendingInfo}>
            <Text style={styles.trendingName} numberOfLines={1}>
              {tournament.name}
            </Text>
            <View style={styles.trendingMeta}>
              <Text style={styles.gameIcon}>🎯</Text>
              <Text style={styles.gameName}>Valorant</Text>
            </View>
          </View>
          
          {tournament.featured && (
            <View style={styles.featuredBadge}>
              <Flame size={12} color="#FF4655" />
              <Text style={styles.featuredText}>Hot</Text>
            </View>
          )}
        </View>

        <View style={styles.trendingStats}>
          <View style={styles.statItem}>
            <Users size={14} color={colors.primary} />
            <Text style={styles.statText}>{tournament.participants?.length || 0} players</Text>
          </View>
          <View style={styles.statItem}>
            <Crown size={14} color={colors.warning} />
            <Text style={styles.statText}>{tournament.prize_pool || 'No prize'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.joinButton} activeOpacity={0.8}>
          <Text style={styles.joinButtonText}>Join Tournament</Text>
          <ChevronRight size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Show loading state while checking authentication
  if (!isAuthenticated) {
    return (
      <LoadingState message="Loading your dashboard..." />
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    section: {
      marginBottom: Grid.xxxl,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Grid.xl,
      marginBottom: Grid.lg,
      marginTop: Grid.lg,
    },
    sectionTitle: {
      ...Typography.titleLarge,
      color: colors.text,
    },
    seeAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Grid.xs,
    },
    seeAllText: {
      ...Typography.labelLarge,
      color: colors.primary,
    },
    horizontalScroll: {
      paddingLeft: Grid.xl,
      paddingRight: Grid.md,
    },
    tournamentCard: {
      width: 280,
      marginRight: Grid.md,
    },
    firstCard: {
      marginLeft: 0,
    },
    trendingList: {
      paddingHorizontal: Grid.xl,
      gap: Grid.md,
    },
    trendingCard: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: ComponentSpecs.card.borderRadius,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    featuredCard: {
      borderColor: '#FF4655',
      borderWidth: 1,
      backgroundColor: 'rgba(255, 70, 85, 0.05)',
    },
    trendingImage: {
      width: 80,
      height: 80,
    },
    trendingContent: {
      flex: 1,
      padding: Grid.md,
      justifyContent: 'space-between',
    },
    trendingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: Grid.sm,
    },
    trendingInfo: {
      flex: 1,
    },
    trendingName: {
      ...Typography.titleSmall,
      color: colors.text,
      marginBottom: Grid.xs,
    },
    trendingMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Grid.xs,
    },
    gameIcon: {
      fontSize: 14,
    },
    gameName: {
      ...Typography.bodySmall,
      color: colors.textSecondary,
    },
    featuredBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 70, 85, 0.2)',
      paddingHorizontal: Grid.sm,
      paddingVertical: Grid.xs,
      borderRadius: ComponentSpecs.button.borderRadius,
      gap: Grid.xs,
    },
    featuredText: {
      ...Typography.labelSmall,
      color: '#FF4655',
      textTransform: 'uppercase',
    },
    trendingStats: {
      flexDirection: 'row',
      gap: Grid.lg,
      marginBottom: Grid.sm,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Grid.xs,
    },
    statText: {
      ...Typography.bodySmall,
      color: colors.textSecondary,
    },
    joinButton: {
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Grid.sm,
      paddingHorizontal: Grid.md,
      borderRadius: ComponentSpecs.button.borderRadius,
      gap: Grid.xs,
      alignSelf: 'flex-start',
    },
    joinButtonText: {
      ...Typography.labelMedium,
      color: '#FFFFFF',
    },
    clanChallengeCard: {
      backgroundColor: 'rgba(127, 90, 240, 0.1)',
      borderRadius: ComponentSpecs.card.borderRadius,
      padding: Grid.lg,
      marginHorizontal: Grid.xl,
      borderWidth: 1,
      borderColor: 'rgba(127, 90, 240, 0.3)',
      marginBottom: Grid.lg,
    },
    challengeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Grid.md,
      gap: Grid.sm,
    },
    challengeTitle: {
      ...Typography.titleMedium,
      color: colors.text,
    },
    challengeMatch: {
      ...Typography.bodyLarge,
      color: colors.text,
      marginBottom: Grid.sm,
    },
    challengeCountdown: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Grid.sm,
    },
    countdownText: {
      ...Typography.bodyMedium,
      color: colors.textSecondary,
    },
    countdownTime: {
      ...Typography.labelLarge,
      color: colors.primary,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Grid.xxxxl,
      paddingHorizontal: Grid.xl,
    },
    emptyStateText: {
      ...Typography.bodyMedium,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: Grid.md,
    },
  });

  return (
    <View style={styles.container}>
      <Header
        title={userProfile?.display_name ? `Hello, ${userProfile.display_name}` : "Good Evening"}
        subtitle="Ready for some matches?"
        onNotificationPress={() => console.log('Notifications')}
        onProfilePress={() => router.push('/(tabs)/profile')}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Grid.xxxxl }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* My Tournaments Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Tournaments</Text>
              <TouchableOpacity style={styles.seeAllButton} onPress={handleSeeAllTournaments}>
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {myTournaments.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {myTournaments.map((tournament, index) => 
                  renderTournamentCard(tournament, index)
                )}
              </ScrollView>
            ) : (
              <View style={styles.emptyState}>
                <Trophy size={48} color={colors.textSecondary} />
                <Text style={styles.emptyStateText}>
                  You haven't joined any tournaments yet. Browse tournaments to get started!
                </Text>
              </View>
            )}
          </View>

          {/* Clan Challenges Section */}
          {clanChallenge && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Clan Challenge</Text>
              </View>

              <TouchableOpacity 
                style={styles.clanChallengeCard} 
                activeOpacity={0.8}
                onPress={handleClanChallengePress}
              >
                <View style={styles.challengeHeader}>
                  <Zap size={20} color={colors.primary} />
                  <Text style={styles.challengeTitle}>Next Match</Text>
                </View>
                
                <Text style={styles.challengeMatch}>
                  {clanChallenge.matchName}
                </Text>
                
                <View style={styles.challengeCountdown}>
                  <Clock size={16} color={colors.primary} />
                  <Text style={styles.countdownText}>Starts in:</Text>
                  <Text style={styles.countdownTime}>
                    {getTimeUntilMatch(clanChallenge.startTime)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Trending Tournaments Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trending Tournaments</Text>
              <TouchableOpacity style={styles.seeAllButton} onPress={handleSeeAllTournaments}>
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {trendingTournaments.length > 0 ? (
              <View style={styles.trendingList}>
                {trendingTournaments.map((tournament) => 
                  renderTrendingCard(tournament)
                )}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Trophy size={48} color={colors.textSecondary} />
                <Text style={styles.emptyStateText}>
                  No trending tournaments available at the moment.
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}