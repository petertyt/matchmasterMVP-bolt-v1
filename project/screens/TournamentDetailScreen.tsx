import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard as Edit3, Trophy, Users, Calendar, Clock, Target, Crown, MessageCircle, Send, Play, CircleCheck as CheckCircle, Circle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Spacing, BorderRadius } from '@/constants/Spacing';

interface Tournament {
  id: string;
  title: string;
  format: 'single_elimination' | 'double_elimination' | 'round_robin';
  status: 'upcoming' | 'active' | 'completed';
  participants: Participant[];
  created_by: string;
  created_at: string;
  start_date: string;
  prize_pool: string;
  max_participants: number;
  game: string;
  rules: string;
  description: string;
  image: string;
}

interface Participant {
  id: string;
  name: string;
  logo: string;
  type: 'clan' | 'individual';
  members?: string[];
}

interface Match {
  id: string;
  tournament_id: string;
  round: number;
  participant_a: Participant;
  participant_b: Participant;
  score_a?: number;
  score_b?: number;
  status: 'pending' | 'active' | 'completed';
  scheduled_time?: string;
  winner_id?: string;
}

interface ChatMessage {
  id: string;
  user: string;
  clan?: string;
  message: string;
  timestamp: string;
  avatar?: string;
}

interface TournamentDetailScreenProps {
  tournamentId?: string;
  onBack?: () => void;
}

export default function TournamentDetailScreen({ 
  tournamentId = '1', 
  onBack 
}: TournamentDetailScreenProps) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'bracket' | 'info' | 'matches' | 'chat'>('bracket');
  const [chatMessage, setChatMessage] = useState('');

  // Mock tournament data
  const tournament: Tournament = {
    id: '1',
    title: 'Championship League 2025',
    format: 'single_elimination',
    status: 'active',
    participants: [
      {
        id: '1',
        name: 'Thunder Bolts',
        logo: '⚡',
        type: 'clan',
        members: ['StormKing', 'LightningStrike', 'ThunderBolt'],
      },
      {
        id: '2',
        name: 'Elite Warriors',
        logo: '⚔️',
        type: 'clan',
        members: ['DragonMaster', 'SwordSlayer', 'BattleAxe'],
      },
      {
        id: '3',
        name: 'Phoenix Rising',
        logo: '🔥',
        type: 'clan',
        members: ['FireBird', 'FlameWing', 'BurningPhoenix'],
      },
      {
        id: '4',
        name: 'Ice Guardians',
        logo: '❄️',
        type: 'clan',
        members: ['FrostLord', 'IceBreaker', 'ColdStorm'],
      },
      {
        id: '5',
        name: 'Shadow Hunters',
        logo: '🌙',
        type: 'clan',
        members: ['NightCrawler', 'ShadowBlade', 'DarkAssassin'],
      },
      {
        id: '6',
        name: 'Solar Knights',
        logo: '☀️',
        type: 'clan',
        members: ['SunWarrior', 'LightBringer', 'GoldenKnight'],
      },
      {
        id: '7',
        name: 'Void Walkers',
        logo: '🌌',
        type: 'clan',
        members: ['VoidMaster', 'StarWalker', 'CosmicRider'],
      },
      {
        id: '8',
        name: 'Earth Shakers',
        logo: '🌍',
        type: 'clan',
        members: ['RockCrusher', 'EarthQuake', 'MountainKing'],
      },
    ],
    created_by: 'TournamentMaster',
    created_at: '2025-01-01',
    start_date: '2025-01-15',
    prize_pool: '$500',
    max_participants: 8,
    game: 'Valorant',
    rules: 'Best of 3 matches, standard competitive rules apply.',
    description: 'The ultimate championship tournament featuring the best clans.',
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
  };

  // Mock matches data
  const matches: Match[] = [
    {
      id: '1',
      tournament_id: '1',
      round: 1,
      participant_a: tournament.participants[0],
      participant_b: tournament.participants[1],
      score_a: 2,
      score_b: 1,
      status: 'completed',
      scheduled_time: '2025-01-15T14:00:00Z',
      winner_id: '1',
    },
    {
      id: '2',
      tournament_id: '1',
      round: 1,
      participant_a: tournament.participants[2],
      participant_b: tournament.participants[3],
      score_a: 2,
      score_b: 0,
      status: 'completed',
      scheduled_time: '2025-01-15T16:00:00Z',
      winner_id: '3',
    },
    {
      id: '3',
      tournament_id: '1',
      round: 1,
      participant_a: tournament.participants[4],
      participant_b: tournament.participants[5],
      status: 'active',
      scheduled_time: '2025-01-16T14:00:00Z',
    },
    {
      id: '4',
      tournament_id: '1',
      round: 1,
      participant_a: tournament.participants[6],
      participant_b: tournament.participants[7],
      status: 'pending',
      scheduled_time: '2025-01-16T16:00:00Z',
    },
    {
      id: '5',
      tournament_id: '1',
      round: 2,
      participant_a: tournament.participants[0], // Winner of match 1
      participant_b: tournament.participants[2], // Winner of match 2
      status: 'pending',
      scheduled_time: '2025-01-17T15:00:00Z',
    },
  ];

  // Mock chat messages
  const chatMessages: ChatMessage[] = [
    {
      id: '1',
      user: 'StormKing',
      clan: 'Thunder Bolts',
      message: 'Good luck to all teams! May the best clan win! ⚡',
      timestamp: '2025-01-15T10:30:00Z',
    },
    {
      id: '2',
      user: 'DragonMaster',
      clan: 'Elite Warriors',
      message: 'Ready for battle! Our swords are sharp! ⚔️',
      timestamp: '2025-01-15T10:35:00Z',
    },
    {
      id: '3',
      user: 'FireBird',
      clan: 'Phoenix Rising',
      message: 'We will rise from any defeat! 🔥',
      timestamp: '2025-01-15T10:40:00Z',
    },
    {
      id: '4',
      user: 'FrostLord',
      clan: 'Ice Guardians',
      message: 'The ice never melts under pressure ❄️',
      timestamp: '2025-01-15T11:00:00Z',
    },
    {
      id: '5',
      user: 'TournamentMaster',
      message: 'Tournament brackets are now live! Check the bracket tab for updates.',
      timestamp: '2025-01-15T12:00:00Z',
    },
  ];

  // Check if current user is organizer
  const isOrganizer = tournament.created_by === 'TournamentMaster'; // Mock check
  
  // Check if user's clan is participating
  const userClan = 'Thunder Bolts'; // Mock user clan
  const isParticipating = tournament.participants.some(p => p.name === userClan);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.error;
      case 'completed':
        return colors.accent;
      case 'pending':
        return colors.warning;
      case 'upcoming':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play size={14} color={colors.error} />;
      case 'completed':
        return <CheckCircle size={14} color={colors.accent} />;
      case 'pending':
        return <Clock size={14} color={colors.warning} />;
      default:
        return <Circle size={14} color={colors.textSecondary} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderBracketTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Tournament Bracket</Text>
      
      {/* Round 1 */}
      <View style={styles.roundContainer}>
        <Text style={styles.roundTitle}>Quarterfinals</Text>
        <View style={styles.matchesGrid}>
          {matches.filter(m => m.round === 1).map((match) => (
            <View key={match.id} style={styles.bracketMatch}>
              <View style={styles.bracketTeam}>
                <Text style={styles.teamLogo}>{match.participant_a.logo}</Text>
                <Text style={styles.teamName}>{match.participant_a.name}</Text>
                {match.score_a !== undefined && (
                  <Text style={[
                    styles.teamScore,
                    match.winner_id === match.participant_a.id && styles.winnerScore
                  ]}>
                    {match.score_a}
                  </Text>
                )}
              </View>
              
              <View style={styles.matchDivider}>
                <Text style={styles.vsText}>VS</Text>
              </View>
              
              <View style={styles.bracketTeam}>
                <Text style={styles.teamLogo}>{match.participant_b.logo}</Text>
                <Text style={styles.teamName}>{match.participant_b.name}</Text>
                {match.score_b !== undefined && (
                  <Text style={[
                    styles.teamScore,
                    match.winner_id === match.participant_b.id && styles.winnerScore
                  ]}>
                    {match.score_b}
                  </Text>
                )}
              </View>
              
              <View style={styles.matchStatus}>
                {getStatusIcon(match.status)}
                <Text style={[styles.statusText, { color: getStatusColor(match.status) }]}>
                  {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Round 2 */}
      <View style={styles.roundContainer}>
        <Text style={styles.roundTitle}>Semifinals</Text>
        <View style={styles.matchesGrid}>
          {matches.filter(m => m.round === 2).map((match) => (
            <View key={match.id} style={styles.bracketMatch}>
              <View style={styles.bracketTeam}>
                <Text style={styles.teamLogo}>{match.participant_a.logo}</Text>
                <Text style={styles.teamName}>{match.participant_a.name}</Text>
                {match.score_a !== undefined && (
                  <Text style={styles.teamScore}>{match.score_a}</Text>
                )}
              </View>
              
              <View style={styles.matchDivider}>
                <Text style={styles.vsText}>VS</Text>
              </View>
              
              <View style={styles.bracketTeam}>
                <Text style={styles.teamLogo}>{match.participant_b.logo}</Text>
                <Text style={styles.teamName}>{match.participant_b.name}</Text>
                {match.score_b !== undefined && (
                  <Text style={styles.teamScore}>{match.score_b}</Text>
                )}
              </View>
              
              <View style={styles.matchStatus}>
                {getStatusIcon(match.status)}
                <Text style={[styles.statusText, { color: getStatusColor(match.status) }]}>
                  {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderInfoTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Tournament Information</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Format:</Text>
            <Text style={styles.infoValue}>
              {tournament.format.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Game:</Text>
            <Text style={styles.infoValue}>{tournament.game}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Organizer:</Text>
            <Text style={styles.infoValue}>{tournament.created_by}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Participants:</Text>
            <Text style={styles.infoValue}>
              {tournament.participants.length}/{tournament.max_participants}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Prize Pool:</Text>
            <Text style={styles.infoValue}>{tournament.prize_pool}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Start Date:</Text>
            <Text style={styles.infoValue}>{formatDate(tournament.start_date)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Description</Text>
        <View style={styles.infoCard}>
          <Text style={styles.descriptionText}>{tournament.description}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Rules</Text>
        <View style={styles.infoCard}>
          <Text style={styles.descriptionText}>{tournament.rules}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Participants</Text>
        {tournament.participants.map((participant) => (
          <View key={participant.id} style={styles.participantCard}>
            <Text style={styles.participantLogo}>{participant.logo}</Text>
            <View style={styles.participantInfo}>
              <Text style={styles.participantName}>{participant.name}</Text>
              {participant.members && (
                <Text style={styles.participantMembers}>
                  {participant.members.join(', ')}
                </Text>
              )}
            </View>
            {participant.name === userClan && (
              <View style={styles.yourClanBadge}>
                <Text style={styles.yourClanText}>Your Clan</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderMatchesTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>All Matches</Text>
      
      {matches.map((match) => {
        const isUserMatch = match.participant_a.name === userClan || match.participant_b.name === userClan;
        
        return (
          <View 
            key={match.id} 
            style={[
              styles.matchCard,
              isUserMatch && styles.userMatchCard
            ]}
          >
            <View style={styles.matchHeader}>
              <View style={styles.matchTeams}>
                <View style={styles.matchTeam}>
                  <Text style={styles.matchTeamLogo}>{match.participant_a.logo}</Text>
                  <Text style={styles.matchTeamName}>{match.participant_a.name}</Text>
                </View>
                
                <View style={styles.matchVs}>
                  <Text style={styles.matchVsText}>VS</Text>
                  {match.score_a !== undefined && match.score_b !== undefined && (
                    <Text style={styles.matchScore}>
                      {match.score_a} - {match.score_b}
                    </Text>
                  )}
                </View>
                
                <View style={styles.matchTeam}>
                  <Text style={styles.matchTeamLogo}>{match.participant_b.logo}</Text>
                  <Text style={styles.matchTeamName}>{match.participant_b.name}</Text>
                </View>
              </View>
              
              <View style={styles.matchMeta}>
                <View style={styles.matchStatusBadge}>
                  {getStatusIcon(match.status)}
                  <Text style={[styles.matchStatusText, { color: getStatusColor(match.status) }]}>
                    {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.matchFooter}>
              <View style={styles.matchInfo}>
                <Calendar size={14} color={colors.textSecondary} />
                <Text style={styles.matchTime}>
                  {match.scheduled_time ? formatDate(match.scheduled_time) : 'TBD'}
                </Text>
              </View>
              
              <Text style={styles.matchRound}>
                Round {match.round}
              </Text>
            </View>
            
            {isUserMatch && (
              <View style={styles.userMatchIndicator}>
                <Text style={styles.userMatchText}>Your Match</Text>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );

  const renderChatTab = () => (
    <View style={styles.chatContainer}>
      <ScrollView style={styles.chatMessages} showsVerticalScrollIndicator={false}>
        {chatMessages.map((message) => (
          <View key={message.id} style={styles.chatMessage}>
            <View style={styles.messageHeader}>
              <View style={styles.messageUser}>
                {message.clan && (
                  <Text style={styles.messageClan}>[{message.clan}]</Text>
                )}
                <Text style={styles.messageUsername}>{message.user}</Text>
              </View>
              <Text style={styles.messageTime}>
                {formatDate(message.timestamp)}
              </Text>
            </View>
            <Text style={styles.messageText}>{message.message}</Text>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.chatInput}>
        <TextInput
          style={styles.chatTextInput}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          value={chatMessage}
          onChangeText={setChatMessage}
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={() => {
            if (chatMessage.trim()) {
              // Handle send message
              setChatMessage('');
            }
          }}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0F0E17',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    headerInfo: {
      flex: 1,
    },
    tournamentTitle: {
      fontSize: FontSize.lg,
      fontFamily: 'Poppins-SemiBold',
      color: '#FFFFFF',
      marginBottom: Spacing.xs,
    },
    formatBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(127, 90, 240, 0.2)',
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
      alignSelf: 'flex-start',
      gap: Spacing.xs,
    },
    formatText: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-SemiBold',
      color: '#7F5AF0',
      textTransform: 'uppercase',
    },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#7F5AF0',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      gap: Spacing.xs,
    },
    editButtonText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    tabNavigation: {
      flexDirection: 'row',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    tab: {
      flex: 1,
      paddingVertical: Spacing.md,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: '#7F5AF0',
    },
    tabText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: 'rgba(255, 255, 255, 0.6)',
    },
    activeTabText: {
      color: '#7F5AF0',
    },
    tabContent: {
      flex: 1,
      padding: Spacing.xl,
    },
    sectionTitle: {
      fontSize: FontSize.lg,
      fontFamily: 'Poppins-SemiBold',
      color: '#FFFFFF',
      marginBottom: Spacing.lg,
    },
    roundContainer: {
      marginBottom: Spacing.xxxl,
    },
    roundTitle: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-SemiBold',
      color: '#7F5AF0',
      marginBottom: Spacing.lg,
      textAlign: 'center',
    },
    matchesGrid: {
      gap: Spacing.lg,
    },
    bracketMatch: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    bracketTeam: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.sm,
      gap: Spacing.sm,
    },
    teamLogo: {
      fontSize: FontSize.lg,
      width: 32,
    },
    teamName: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      flex: 1,
    },
    teamScore: {
      fontSize: FontSize.lg,
      fontFamily: 'Inter-Bold',
      color: 'rgba(255, 255, 255, 0.7)',
      minWidth: 24,
      textAlign: 'center',
    },
    winnerScore: {
      color: '#2CB67D',
    },
    matchDivider: {
      alignItems: 'center',
      paddingVertical: Spacing.xs,
    },
    vsText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    matchStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.xs,
      marginTop: Spacing.sm,
      paddingTop: Spacing.sm,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    statusText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
    },
    infoSection: {
      marginBottom: Spacing.xxxl,
    },
    infoCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    infoLabel: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Medium',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    infoValue: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    descriptionText: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.8)',
      lineHeight: 24,
    },
    participantCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    participantLogo: {
      fontSize: FontSize.xl,
      marginRight: Spacing.md,
    },
    participantInfo: {
      flex: 1,
    },
    participantName: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginBottom: Spacing.xs,
    },
    participantMembers: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.6)',
    },
    yourClanBadge: {
      backgroundColor: '#7F5AF0',
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
    },
    yourClanText: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    matchCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    userMatchCard: {
      borderColor: '#7F5AF0',
      backgroundColor: 'rgba(127, 90, 240, 0.05)',
    },
    matchHeader: {
      marginBottom: Spacing.md,
    },
    matchTeams: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    matchTeam: {
      flex: 1,
      alignItems: 'center',
    },
    matchTeamLogo: {
      fontSize: FontSize.lg,
      marginBottom: Spacing.xs,
    },
    matchTeamName: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    matchVs: {
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
    },
    matchVsText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    matchScore: {
      fontSize: FontSize.lg,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginTop: Spacing.xs,
    },
    matchMeta: {
      alignItems: 'center',
    },
    matchStatusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    matchStatusText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
    },
    matchFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: Spacing.sm,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    matchInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    matchTime: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    matchRound: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
      color: '#7F5AF0',
    },
    userMatchIndicator: {
      position: 'absolute',
      top: Spacing.sm,
      right: Spacing.sm,
      backgroundColor: '#7F5AF0',
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
    },
    userMatchText: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    chatContainer: {
      flex: 1,
    },
    chatMessages: {
      flex: 1,
      padding: Spacing.xl,
    },
    chatMessage: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    messageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    messageUser: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    messageClan: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: '#7F5AF0',
    },
    messageUsername: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    messageTime: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    messageText: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.8)',
      lineHeight: 22,
    },
    chatInput: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.05)',
      gap: Spacing.sm,
    },
    chatTextInput: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      fontSize: FontSize.base,
      fontFamily: 'Inter-Regular',
      color: '#FFFFFF',
      maxHeight: 100,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#7F5AF0',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.tournamentTitle}>{tournament.title}</Text>
            <View style={styles.formatBadge}>
              <Target size={12} color="#7F5AF0" />
              <Text style={styles.formatText}>
                {tournament.format.replace('_', ' ')}
              </Text>
            </View>
          </View>
        </View>
        
        {isOrganizer && (
          <TouchableOpacity style={styles.editButton}>
            <Edit3 size={16} color="#FFFFFF" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        {['bracket', 'info', 'matches', 'chat'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {activeTab === 'bracket' && renderBracketTab()}
      {activeTab === 'info' && renderInfoTab()}
      {activeTab === 'matches' && renderMatchesTab()}
      {activeTab === 'chat' && renderChatTab()}
    </SafeAreaView>
  );
}