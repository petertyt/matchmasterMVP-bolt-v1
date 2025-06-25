import { useState } from 'react';
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
  Filter, 
  Plus, 
  Trophy, 
  Users, 
  Calendar,
  Crown,
  Medal,
  Target
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuthContext } from '@/components/AuthProvider';
import { Grid, Typography, ComponentSpecs } from '@/constants/DesignSystem';
import Header from '@/components/ui/Header';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import TournamentCard from '@/components/ui/TournamentCard';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';

export default function TournamentsScreen() {
  const { colors } = useTheme();
  const { user, isAuthenticated } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock tournaments data for testing
  const [tournaments] = useState([
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
      status: 'registration',
      participants: ['user1'],
      max_participants: 8,
      start_date: '2025-01-25T16:00:00Z',
      prize_pool: '$200',
      image_url: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg',
    },
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
    },
    {
      id: '4',
      name: 'Spring Showdown',
      format: 'single_elimination',
      status: 'upcoming',
      participants: ['user4', 'user7'],
      max_participants: 32,
      start_date: '2025-02-15T20:00:00Z',
      prize_pool: '$750',
      image_url: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg',
    },
    {
      id: '5',
      name: 'Autumn Classic',
      format: 'single_elimination',
      status: 'completed',
      participants: ['user3', 'user4', 'user7', 'user8'],
      max_participants: 8,
      start_date: '2024-12-01T14:00:00Z',
      prize_pool: '$300',
      image_url: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
    }
  ]);

  // Filter tournaments by search query
  const filteredTournaments = tournaments.filter((tournament) =>
    tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filters = [
    { key: 'all', label: 'All', count: tournaments.length },
    { key: 'registration', label: 'Open', count: tournaments.filter(t => t.status === 'registration').length },
    { key: 'active', label: 'Live', count: tournaments.filter(t => t.status === 'active').length },
    { key: 'upcoming', label: 'Upcoming', count: tournaments.filter(t => t.status === 'upcoming').length },
    { key: 'completed', label: 'Completed', count: tournaments.filter(t => t.status === 'completed').length },
  ];

  const handleCreateTournament = () => {
    if (!isAuthenticated) {
      Alert.alert('Sign In Required', 'Please sign in to create tournaments.');
      return;
    }
    console.log('Create tournament');
    // Navigate to create tournament screen
  };

  const handleTournamentPress = (tournament: any) => {
    console.log('Tournament pressed:', tournament.id);
    // Navigate to tournament detail screen
  };

  const handleJoinTournament = async (tournament: any) => {
    if (!isAuthenticated || !user) {
      Alert.alert('Sign In Required', 'Please sign in to join tournaments.');
      return;
    }

    if (tournament.participants?.includes(user.id)) {
      // User is already in tournament, show leave option
      Alert.alert(
        'Leave Tournament',
        `Are you sure you want to leave ${tournament.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Leave', 
            style: 'destructive',
            onPress: async () => {
              Alert.alert('Success', 'You have left the tournament.');
            }
          },
        ]
      );
    } else {
      // User wants to join
      Alert.alert(
        'Join Tournament',
        `Join ${tournament.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Join', 
            onPress: async () => {
              Alert.alert('Success', 'You have joined the tournament!');
            }
          },
        ]
      );
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleRetry = () => {
    // Retry loading tournaments
    setError(null);
  };

  const handleFilterChange = (filterKey: string) => {
    setSelectedFilter(filterKey);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    filtersContainer: {
      paddingHorizontal: Grid.xl,
      paddingVertical: Grid.lg,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    filtersScroll: {
      flexDirection: 'row',
      gap: Grid.sm,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Grid.md,
      paddingVertical: Grid.sm,
      borderRadius: ComponentSpecs.button.borderRadius,
      borderWidth: 1,
      gap: Grid.xs,
    },
    filterChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterChipInactive: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    filterChipText: {
      ...Typography.labelMedium,
    },
    filterChipTextActive: {
      color: '#FFFFFF',
    },
    filterChipTextInactive: {
      color: colors.textSecondary,
    },
    filterCount: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 2,
      minWidth: 20,
      alignItems: 'center',
    },
    filterCountInactive: {
      backgroundColor: colors.surfaceVariant,
    },
    filterCountText: {
      fontSize: 10,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    filterCountTextInactive: {
      color: colors.textTertiary,
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
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Grid.xxxxl,
    },
    emptyStateIcon: {
      marginBottom: Grid.lg,
    },
    emptyStateTitle: {
      ...Typography.titleMedium,
      color: colors.text,
      marginBottom: Grid.sm,
    },
    emptyStateText: {
      ...Typography.bodyMedium,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: Grid.xl,
    },
  });

  if (loading && tournaments.length === 0) {
    return <LoadingState message="Loading tournaments..." />;
  }

  if (error && tournaments.length === 0) {
    return (
      <ErrorState
        title="Failed to load tournaments"
        message={error}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Tournaments"
        subtitle="Compete and climb the ranks"
        onSearchChange={handleSearchChange}
      />

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterChip,
                selectedFilter === filter.key
                  ? styles.filterChipActive
                  : styles.filterChipInactive,
              ]}
              onPress={() => handleFilterChange(filter.key)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === filter.key
                    ? styles.filterChipTextActive
                    : styles.filterChipTextInactive,
                ]}
              >
                {filter.label}
              </Text>
              <View
                style={[
                  styles.filterCount,
                  selectedFilter !== filter.key && styles.filterCountInactive,
                ]}
              >
                <Text
                  style={[
                    styles.filterCountText,
                    selectedFilter !== filter.key && styles.filterCountTextInactive,
                  ]}
                >
                  {filter.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Grid.xxxxl }}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedFilter === 'all' ? 'All Tournaments' : filters.find(f => f.key === selectedFilter)?.label}
          </Text>
          <Text style={styles.resultsCount}>
            {filteredTournaments.length} tournament{filteredTournaments.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {filteredTournaments.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Trophy size={48} color={colors.textSecondary} />
            </View>
            <Text style={styles.emptyStateTitle}>No tournaments found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? `No tournaments match "${searchQuery}"`
                : 'No tournaments available for the selected filter'}
            </Text>
          </View>
        ) : (
          filteredTournaments.map((tournament, index) => {
            // Convert tournament to TournamentCard format
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
              <TournamentCard
                key={tournament.id}
                tournament={cardTournament}
                onPress={() => handleTournamentPress(tournament)}
                variant={index === 0 ? 'featured' : 'default'}
              />
            );
          })
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton
        onPress={handleCreateTournament}
        icon={<Plus size={24} color="#FFFFFF" strokeWidth={2.5} />}
      />
    </View>
  );
}