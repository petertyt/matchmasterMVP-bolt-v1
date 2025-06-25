import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, 
  Plus, 
  Users, 
  Crown, 
  Shield, 
  Star,
  TrendingUp,
  Award,
  ChevronRight,
  UserPlus
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuthContext } from '@/components/AuthProvider';
import { useClans } from '@/hooks/useClans';
import { Grid, Typography, ComponentSpecs } from '@/constants/DesignSystem';
import Header from '@/components/ui/Header';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import ClanCard from '@/components/ui/ClanCard';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';

export default function ClansScreen() {
  const { colors } = useTheme();
  const { user, userProfile, isAuthenticated } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'my-clan' | 'explore' | 'invites'>('my-clan');
  const [userClan, setUserClan] = useState<any>(null);
  const [userClanLoading, setUserClanLoading] = useState(false);

  // Fetch user's clan if they have one
  React.useEffect(() => {
    const fetchUserClan = async () => {
      if (isAuthenticated && user && userProfile?.clan_id) {
        setUserClanLoading(true);
        try {
          // Mock clan data for testing
          const mockClan = {
            id: 'clan-550e8400-e29b-41d4-a716-446655440001',
            name: 'Thunder Bolts',
            tag: 'THDR',
            description: 'Elite competitive gaming clan focused on tournament victories',
            logo_url: null,
            member_ids: ['550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440006'],
            captain_ids: ['550e8400-e29b-41d4-a716-446655440003'],
            leader_id: '550e8400-e29b-41d4-a716-446655440003',
            level: 38,
            xp: 15000,
            max_members: 20,
            is_public: true,
            stats: {
              total_matches: 98,
              wins: 78,
              losses: 20,
              win_rate: 79.6,
              tournaments_won: 12,
              current_streak: 5,
              best_streak: 15,
              rank: 3
            },
            settings: {
              join_approval_required: false,
              allow_member_invites: true,
              visibility: 'public'
            },
            created_at: '2024-01-15T00:00:00Z',
            updated_at: '2024-01-15T00:00:00Z'
          };
          
          setUserClan(mockClan);
        } catch (error) {
          console.error('Error fetching user clan:', error);
        } finally {
          setUserClanLoading(false);
        }
      }
    };

    fetchUserClan();
  }, [isAuthenticated, user, userProfile?.clan_id]);

  // Fetch available clans for exploration
  const { 
    clans: availableClans, 
    loading: clansLoading, 
    error: clansError,
    joinClan,
    createClan,
    refetch 
  } = useClans({
    filters: { is_public: true, has_space: true },
    queryOptions: { limit: 20, sort_by: 'level', sort_order: 'desc' },
    autoFetch: activeTab === 'explore'
  });

  const filteredClans = availableClans.filter((clan) =>
    clan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clan.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock invites data - would come from a real service
  const clanInvites: any[] = [];

  const handleCreateClan = () => {
    if (!isAuthenticated) {
      Alert.alert('Sign In Required', 'Please sign in to create a clan.');
      return;
    }
    console.log('Create clan');
    Alert.alert('Create Clan', 'Clan creation feature coming soon!');
  };

  const handleClanPress = (clan: any) => {
    console.log('Clan pressed:', clan.id);
    // Navigate to clan detail screen
  };

  const handleJoinClan = async (clan: any) => {
    if (!isAuthenticated || !user) {
      Alert.alert('Sign In Required', 'Please sign in to join clans.');
      return;
    }

    if (userProfile?.clan_id) {
      Alert.alert('Already in Clan', 'You must leave your current clan before joining another.');
      return;
    }

    Alert.alert('Join Clan', `Join ${clan.name} [${clan.tag}]?`, [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Join', 
        onPress: async () => {
          const result = await joinClan(clan.id, user.id);
          if (result.success) {
            Alert.alert('Success', `You have joined ${clan.name}!`);
            // Refresh user clan data
            setActiveTab('my-clan');
          } else {
            Alert.alert('Error', result.error || 'Failed to join clan.');
          }
        }
      },
    ]);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleRetry = () => {
    refetch();
  };

  const renderMyClanView = () => {
    if (userClanLoading) {
      return <LoadingState message="Loading your clan..." />;
    }

    if (!userClan) {
      return (
        <View style={styles.emptyState}>
          <View style={styles.emptyStateIcon}>
            <Shield size={64} color={colors.textSecondary} />
          </View>
          <Text style={styles.emptyStateTitle}>No Clan Yet</Text>
          <Text style={styles.emptyStateText}>
            Join an existing clan or create your own to start competing with a team!
          </Text>
          <View style={styles.emptyStateActions}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleCreateClan}>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Create Clan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setActiveTab('explore')}
            >
              <Search size={20} color={colors.primary} />
              <Text style={styles.secondaryButtonText}>Browse Clans</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Convert clan data to ClanCard format
    const clanCardData = {
      id: userClan.id,
      name: userClan.name,
      tag: userClan.tag,
      members: userClan.member_ids?.length || 0,
      maxMembers: userClan.max_members,
      level: userClan.level,
      wins: userClan.stats?.wins || 0,
      rank: userClan.stats?.rank || 999,
      leader: userClan.leader_id, // Would need to resolve to username
      logo: userClan.logo_url || '⚡',
      isJoined: true,
      isPublic: userClan.is_public,
    };

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Grid.xxxxl }}
      >
        <ClanCard
          clan={clanCardData}
          onPress={handleClanPress}
          variant="detailed"
        />
        
        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Crown size={24} color={colors.warning} />
            <Text style={styles.statValue}>#{clanCardData.rank}</Text>
            <Text style={styles.statLabel}>Global Rank</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={24} color={colors.success} />
            <Text style={styles.statValue}>{clanCardData.wins}</Text>
            <Text style={styles.statLabel}>Total Wins</Text>
          </View>
          <View style={styles.statCard}>
            <Star size={24} color={colors.primary} />
            <Text style={styles.statValue}>{clanCardData.level}</Text>
            <Text style={styles.statLabel}>Clan Level</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={24} color={colors.secondary} />
            <Text style={styles.statValue}>{clanCardData.members}</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>
              🏆 Won tournament "Spring Championship"
            </Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>
              ⚡ New member "LightningStrike" joined
            </Text>
            <Text style={styles.activityTime}>1 day ago</Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderExploreView = () => {
    if (clansLoading) {
      return <LoadingState message="Loading clans..." />;
    }

    if (clansError) {
      return (
        <ErrorState
          title="Failed to load clans"
          message={clansError}
          onRetry={handleRetry}
        />
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Grid.xxxxl }}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Clans</Text>
          <Text style={styles.resultsCount}>
            {filteredClans.length} clan{filteredClans.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {filteredClans.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Users size={48} color={colors.textSecondary} />
            </View>
            <Text style={styles.emptyStateTitle}>No clans found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? `No clans match "${searchQuery}"`
                : 'No clans available'}
            </Text>
          </View>
        ) : (
          filteredClans.map((clan) => {
            // Convert clan data to ClanCard format
            const clanCardData = {
              id: clan.id,
              name: clan.name,
              tag: clan.tag,
              members: clan.member_ids?.length || 0,
              maxMembers: clan.max_members,
              level: clan.level,
              wins: clan.stats?.wins || 0,
              rank: clan.stats?.rank || 999,
              leader: clan.leader_id, // Would need to resolve to username
              logo: clan.logo_url || '⚔️',
              isJoined: false,
              isPublic: clan.is_public,
            };

            return (
              <ClanCard
                key={clan.id}
                clan={clanCardData}
                onPress={handleClanPress}
                onJoin={handleJoinClan}
              />
            );
          })
        )}
      </ScrollView>
    );
  };

  const renderInvitesView = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <UserPlus size={48} color={colors.textSecondary} />
      </View>
      <Text style={styles.emptyStateTitle}>No Invitations</Text>
      <Text style={styles.emptyStateText}>
        You don't have any clan invitations at the moment.
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingHorizontal: Grid.xl,
    },
    tab: {
      flex: 1,
      paddingVertical: Grid.lg,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      ...Typography.labelLarge,
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.primary,
    },
    content: {
      flex: 1,
      paddingHorizontal: Grid.xl,
      paddingTop: Grid.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Grid.lg,
    },
    sectionTitle: {
      ...Typography.titleLarge,
      color: colors.text,
    },
    resultsCount: {
      ...Typography.bodyMedium,
      color: colors.textSecondary,
    },
    seeAllText: {
      ...Typography.labelLarge,
      color: colors.primary,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Grid.sm,
      marginBottom: Grid.xl,
    },
    statCard: {
      flex: 1,
      minWidth: '48%',
      backgroundColor: colors.card,
      borderRadius: ComponentSpecs.card.borderRadius,
      padding: Grid.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    statValue: {
      ...Typography.titleLarge,
      color: colors.text,
      marginTop: Grid.sm,
      marginBottom: Grid.xs,
    },
    statLabel: {
      ...Typography.bodySmall,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    section: {
      marginBottom: Grid.xl,
    },
    activityCard: {
      backgroundColor: colors.card,
      borderRadius: ComponentSpecs.card.borderRadius,
      padding: Grid.lg,
      marginBottom: Grid.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activityText: {
      ...Typography.bodyMedium,
      color: colors.text,
      marginBottom: Grid.xs,
    },
    activityTime: {
      ...Typography.bodySmall,
      color: colors.textSecondary,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Grid.xxxxl,
      paddingHorizontal: Grid.xl,
    },
    emptyStateIcon: {
      marginBottom: Grid.lg,
    },
    emptyStateTitle: {
      ...Typography.titleMedium,
      color: colors.text,
      marginBottom: Grid.sm,
      textAlign: 'center',
    },
    emptyStateText: {
      ...Typography.bodyMedium,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: Grid.xl,
    },
    emptyStateActions: {
      flexDirection: 'row',
      gap: Grid.md,
    },
    primaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: Grid.lg,
      paddingVertical: Grid.md,
      borderRadius: ComponentSpecs.button.borderRadius,
      gap: Grid.sm,
    },
    primaryButtonText: {
      ...Typography.labelLarge,
      color: '#FFFFFF',
    },
    secondaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: Grid.lg,
      paddingVertical: Grid.md,
      borderRadius: ComponentSpecs.button.borderRadius,
      borderWidth: 1,
      borderColor: colors.primary,
      gap: Grid.sm,
    },
    secondaryButtonText: {
      ...Typography.labelLarge,
      color: colors.primary,
    },
  });

  if (!isAuthenticated) {
    return (
      <LoadingState message="Please sign in to view clans..." />
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Clans"
        subtitle="Team up and dominate together"
        onSearchChange={handleSearchChange}
        showSearch={activeTab === 'explore'}
      />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'my-clan', label: 'My Clan' },
          { key: 'explore', label: 'Explore' },
          { key: 'invites', label: 'Invites' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'my-clan' && renderMyClanView()}
        {activeTab === 'explore' && renderExploreView()}
        {activeTab === 'invites' && renderInvitesView()}
      </View>

      {/* Floating Action Button */}
      {activeTab === 'explore' && (
        <FloatingActionButton
          onPress={handleCreateClan}
          icon={<Plus size={24} color="#FFFFFF" strokeWidth={2.5} />}
        />
      )}
    </View>
  );
}