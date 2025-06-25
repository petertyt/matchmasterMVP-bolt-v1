import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Users, Clock, Trophy, Send, Settings, Play, Pause, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Crown, Shield, Target, Zap, MessageCircle, Calendar, MapPin, Flag } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, Spacing, BorderRadius } from '@/constants/Spacing';

interface Player {
  id: string;
  username: string;
  avatar?: string;
  role?: 'captain' | 'player';
  isOnline: boolean;
  stats?: {
    kills?: number;
    deaths?: number;
    assists?: number;
  };
}

interface ClanData {
  id: string;
  name: string;
  tag: string;
  logo: string;
  players: Player[];
  score?: number;
  color: string;
}

interface MatchDetails {
  id: string;
  tournament: string;
  format: string;
  bestOf: number;
  map?: string;
  startTime: string;
  duration?: string;
  rules: string[];
}

interface ChatMessage {
  id: string;
  user: string;
  clan?: string;
  message: string;
  timestamp: string;
  type: 'message' | 'system' | 'score_update';
}

interface MatchRoomProps {
  matchId: string;
  clanA: ClanData;
  clanB: ClanData;
  userRole: 'captain' | 'player' | 'spectator';
  matchStatus: 'scheduled' | 'ongoing' | 'completed';
  onBack?: () => void;
}

export default function MatchRoomScreen({
  matchId = 'match_001',
  userRole = 'player',
  matchStatus = 'ongoing',
  onBack
}: Partial<MatchRoomProps>) {
  const { colors } = useTheme();
  const [chatMessage, setChatMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameTime, setGameTime] = useState('15:42');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Mock data
  const clanA: ClanData = {
    id: 'clan_a',
    name: 'Thunder Bolts',
    tag: 'THDR',
    logo: '⚡',
    color: '#7F5AF0',
    score: 12,
    players: [
      {
        id: '1',
        username: 'StormKing',
        role: 'captain',
        isOnline: true,
        stats: { kills: 18, deaths: 12, assists: 8 }
      },
      {
        id: '2',
        username: 'LightningStrike',
        isOnline: true,
        stats: { kills: 15, deaths: 10, assists: 12 }
      },
      {
        id: '3',
        username: 'ThunderBolt',
        isOnline: true,
        stats: { kills: 12, deaths: 14, assists: 9 }
      },
      {
        id: '4',
        username: 'ElectricShock',
        isOnline: false,
        stats: { kills: 8, deaths: 16, assists: 6 }
      },
      {
        id: '5',
        username: 'VoltMaster',
        isOnline: true,
        stats: { kills: 14, deaths: 11, assists: 10 }
      }
    ]
  };

  const clanB: ClanData = {
    id: 'clan_b',
    name: 'Phoenix Rising',
    tag: 'PHNX',
    logo: '🔥',
    color: '#FF4655',
    score: 8,
    players: [
      {
        id: '6',
        username: 'FireBird',
        role: 'captain',
        isOnline: true,
        stats: { kills: 16, deaths: 13, assists: 7 }
      },
      {
        id: '7',
        username: 'FlameWing',
        isOnline: true,
        stats: { kills: 13, deaths: 12, assists: 11 }
      },
      {
        id: '8',
        username: 'BurningPhoenix',
        isOnline: true,
        stats: { kills: 10, deaths: 15, assists: 8 }
      },
      {
        id: '9',
        username: 'InfernoBlaze',
        isOnline: true,
        stats: { kills: 9, deaths: 14, assists: 9 }
      },
      {
        id: '10',
        username: 'EmberStorm',
        isOnline: false,
        stats: { kills: 7, deaths: 17, assists: 5 }
      }
    ]
  };

  const matchDetails: MatchDetails = {
    id: matchId,
    tournament: 'Championship League 2025',
    format: 'Best of 3',
    bestOf: 3,
    map: 'Dust2',
    startTime: '2025-01-15T14:00:00Z',
    duration: '45:23',
    rules: [
      'Standard competitive rules',
      'No coaching during rounds',
      'Technical pause allowed (max 2 per team)',
      'Overtime: MR3 format'
    ]
  };

  const chatMessages: ChatMessage[] = [
    {
      id: '1',
      user: 'System',
      message: 'Match started - Thunder Bolts vs Phoenix Rising',
      timestamp: '2025-01-15T14:00:00Z',
      type: 'system'
    },
    {
      id: '2',
      user: 'StormKing',
      clan: 'THDR',
      message: 'Good luck everyone! Let\'s have a great match! ⚡',
      timestamp: '2025-01-15T14:01:00Z',
      type: 'message'
    },
    {
      id: '3',
      user: 'FireBird',
      clan: 'PHNX',
      message: 'May the best team win! 🔥',
      timestamp: '2025-01-15T14:01:30Z',
      type: 'message'
    },
    {
      id: '4',
      user: 'System',
      message: 'Round 1 completed - Thunder Bolts wins (Score: 1-0)',
      timestamp: '2025-01-15T14:15:00Z',
      type: 'score_update'
    },
    {
      id: '5',
      user: 'LightningStrike',
      clan: 'THDR',
      message: 'Nice round team! Keep it up!',
      timestamp: '2025-01-15T14:15:30Z',
      type: 'message'
    }
  ];

  // Check if current user is in either clan
  const userClan = clanA.players.find(p => p.username === 'ThunderBolt') ? 'clan_a' : 
                   clanB.players.find(p => p.username === 'ThunderBolt') ? 'clan_b' : null;
  
  const isCaptain = userRole === 'captain';
  const isPlayer = userRole === 'player' || userRole === 'captain';

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

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (matchStatus === 'ongoing') {
        // Update game time
        const [minutes, seconds] = gameTime.split(':').map(Number);
        const totalSeconds = minutes * 60 + seconds + 1;
        const newMinutes = Math.floor(totalSeconds / 60);
        const newSeconds = totalSeconds % 60;
        setGameTime(`${newMinutes}:${newSeconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameTime, matchStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return colors.error;
      case 'scheduled':
        return colors.warning;
      case 'completed':
        return colors.accent;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ongoing':
        return <Play size={16} color={colors.error} />;
      case 'scheduled':
        return <Clock size={16} color={colors.warning} />;
      case 'completed':
        return <CheckCircle size={16} color={colors.accent} />;
      default:
        return <AlertCircle size={16} color={colors.textSecondary} />;
    }
  };

  const handleScoreSubmission = () => {
    if (!isCaptain) {
      Alert.alert('Permission Denied', 'Only team captains can submit scores.');
      return;
    }

    Alert.alert(
      'Submit Score',
      'Are you sure you want to submit the current score?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Submit', 
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              Alert.alert('Success', 'Score submitted successfully!');
            }, 2000);
          }
        }
      ]
    );
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Handle send message logic here
      setChatMessage('');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderPlayerCard = (player: Player, clanColor: string, isUserTeam: boolean) => (
    <View 
      key={player.id} 
      style={[
        styles.playerCard,
        isUserTeam && styles.userTeamCard,
        { borderLeftColor: clanColor }
      ]}
    >
      <View style={styles.playerHeader}>
        <View style={styles.playerInfo}>
          <View style={[styles.playerAvatar, { backgroundColor: clanColor }]}>
            <Text style={styles.playerAvatarText}>
              {player.username.charAt(0).toUpperCase()}
            </Text>
            {player.isOnline && <View style={styles.onlineIndicator} />}
          </View>
          
          <View style={styles.playerDetails}>
            <View style={styles.playerNameRow}>
              <Text style={styles.playerName}>{player.username}</Text>
              {player.role === 'captain' && (
                <Crown size={14} color="#FFD700" />
              )}
            </View>
            <Text style={[
              styles.playerStatus,
              { color: player.isOnline ? colors.accent : colors.textSecondary }
            ]}>
              {player.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        {matchStatus === 'ongoing' && player.stats && (
          <View style={styles.playerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{player.stats.kills}</Text>
              <Text style={styles.statLabel}>K</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{player.stats.deaths}</Text>
              <Text style={styles.statLabel}>D</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{player.stats.assists}</Text>
              <Text style={styles.statLabel}>A</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const renderChatMessage = (message: ChatMessage) => (
    <View key={message.id} style={[
      styles.chatMessage,
      message.type === 'system' && styles.systemMessage,
      message.type === 'score_update' && styles.scoreUpdateMessage
    ]}>
      <View style={styles.messageHeader}>
        <View style={styles.messageUser}>
          {message.clan && (
            <Text style={[styles.messageClan, { 
              color: message.clan === 'THDR' ? clanA.color : clanB.color 
            }]}>
              [{message.clan}]
            </Text>
          )}
          <Text style={[
            styles.messageUsername,
            message.type === 'system' && styles.systemUsername
          ]}>
            {message.user}
          </Text>
        </View>
        <Text style={styles.messageTime}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
      <Text style={[
        styles.messageText,
        message.type === 'system' && styles.systemMessageText
      ]}>
        {message.message}
      </Text>
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
    matchInfo: {
      flex: 1,
    },
    matchTitle: {
      fontSize: FontSize.lg,
      fontFamily: 'Poppins-SemiBold',
      color: '#FFFFFF',
      marginBottom: Spacing.xs,
    },
    matchMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
      gap: Spacing.xs,
    },
    statusText: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-SemiBold',
      textTransform: 'uppercase',
    },
    gameTime: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
    },
    headerActions: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scoreHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.xl,
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    clanScore: {
      alignItems: 'center',
      flex: 1,
    },
    clanLogo: {
      fontSize: FontSize.xxxxl,
      marginBottom: Spacing.sm,
    },
    clanName: {
      fontSize: FontSize.lg,
      fontFamily: 'Poppins-SemiBold',
      color: '#FFFFFF',
      marginBottom: Spacing.xs,
    },
    clanTag: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
      marginBottom: Spacing.sm,
    },
    score: {
      fontSize: FontSize.xxxxl,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    vsContainer: {
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
    },
    vsText: {
      fontSize: FontSize.lg,
      fontFamily: 'Inter-Bold',
      color: 'rgba(255, 255, 255, 0.5)',
      marginBottom: Spacing.sm,
    },
    roundInfo: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
    },
    content: {
      flex: 1,
    },
    section: {
      marginBottom: Spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md,
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
    sectionTitle: {
      fontSize: FontSize.base,
      fontFamily: 'Poppins-SemiBold',
      color: '#FFFFFF',
    },
    sectionAction: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
    },
    lineupContainer: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.xl,
    },
    teamColumn: {
      flex: 1,
      marginHorizontal: Spacing.sm,
    },
    teamHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.md,
      paddingBottom: Spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    teamLogo: {
      fontSize: FontSize.lg,
      marginRight: Spacing.sm,
    },
    teamName: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    playerCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      marginBottom: Spacing.sm,
      borderLeftWidth: 3,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    userTeamCard: {
      backgroundColor: 'rgba(127, 90, 240, 0.05)',
      borderColor: 'rgba(127, 90, 240, 0.2)',
    },
    playerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    playerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    playerAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.sm,
      position: 'relative',
    },
    playerAvatarText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.accent,
      borderWidth: 2,
      borderColor: '#0F0E17',
    },
    playerDetails: {
      flex: 1,
    },
    playerNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      marginBottom: Spacing.xs,
    },
    playerName: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    playerStatus: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-Regular',
    },
    playerStats: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    statLabel: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    matchDetailsCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginHorizontal: Spacing.xl,
      marginBottom: Spacing.lg,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    detailLabel: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    detailValue: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    rulesContainer: {
      marginTop: Spacing.md,
    },
    rulesTitle: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginBottom: Spacing.sm,
    },
    ruleItem: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: Spacing.xs,
      paddingLeft: Spacing.sm,
    },
    scoreActions: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md,
      gap: Spacing.sm,
    },
    scoreButton: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: Spacing.sm,
    },
    scoreButtonDisabled: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    scoreButtonText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    scoreButtonTextDisabled: {
      color: colors.textSecondary,
    },
    chatContainer: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
    chatMessages: {
      flex: 1,
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.md,
    },
    chatMessage: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      marginBottom: Spacing.sm,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    systemMessage: {
      backgroundColor: 'rgba(127, 90, 240, 0.1)',
      borderColor: 'rgba(127, 90, 240, 0.3)',
    },
    scoreUpdateMessage: {
      backgroundColor: 'rgba(44, 182, 125, 0.1)',
      borderColor: 'rgba(44, 182, 125, 0.3)',
    },
    messageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    messageUser: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    messageClan: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-SemiBold',
    },
    messageUsername: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    systemUsername: {
      color: colors.primary,
    },
    messageTime: {
      fontSize: FontSize.xs,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    messageText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.8)',
      lineHeight: 20,
    },
    systemMessageText: {
      color: colors.primary,
      fontFamily: 'Inter-Medium',
    },
    chatInput: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md,
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.05)',
      gap: Spacing.sm,
    },
    chatTextInput: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: '#FFFFFF',
      maxHeight: 80,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 14, 23, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Medium',
      color: '#FFFFFF',
      marginTop: Spacing.md,
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
          
          <View style={styles.matchInfo}>
            <Text style={styles.matchTitle}>
              {clanA.name} vs {clanB.name}
            </Text>
            <View style={styles.matchMeta}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(matchStatus) + '20' }]}>
                {getStatusIcon(matchStatus)}
                <Text style={[styles.statusText, { color: getStatusColor(matchStatus) }]}>
                  {matchStatus.charAt(0).toUpperCase() + matchStatus.slice(1)}
                </Text>
              </View>
              {matchStatus === 'ongoing' && (
                <Text style={styles.gameTime}>{gameTime}</Text>
              )}
            </View>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          {isCaptain && (
            <TouchableOpacity style={styles.actionButton}>
              <Settings size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Score Display */}
      <Animated.View 
        style={[
          styles.scoreHeader,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.clanScore}>
          <Text style={styles.clanLogo}>{clanA.logo}</Text>
          <Text style={styles.clanName}>{clanA.name}</Text>
          <Text style={[styles.clanTag, { color: clanA.color }]}>[{clanA.tag}]</Text>
          <Text style={styles.score}>{clanA.score || 0}</Text>
        </View>
        
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
          <Text style={styles.roundInfo}>Round {currentRound}</Text>
        </View>
        
        <View style={styles.clanScore}>
          <Text style={styles.clanLogo}>{clanB.logo}</Text>
          <Text style={styles.clanName}>{clanB.name}</Text>
          <Text style={[styles.clanTag, { color: clanB.color }]}>[{clanB.tag}]</Text>
          <Text style={styles.score}>{clanB.score || 0}</Text>
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Player Lineups */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Player Lineups</Text>
            <Text style={styles.sectionAction}>5v5</Text>
          </View>
          
          <View style={styles.lineupContainer}>
            {/* Clan A Players */}
            <View style={styles.teamColumn}>
              <View style={styles.teamHeader}>
                <Text style={styles.teamLogo}>{clanA.logo}</Text>
                <Text style={styles.teamName}>{clanA.name}</Text>
              </View>
              {clanA.players.map(player => 
                renderPlayerCard(player, clanA.color, userClan === 'clan_a')
              )}
            </View>

            {/* Clan B Players */}
            <View style={styles.teamColumn}>
              <View style={styles.teamHeader}>
                <Text style={styles.teamLogo}>{clanB.logo}</Text>
                <Text style={styles.teamName}>{clanB.name}</Text>
              </View>
              {clanB.players.map(player => 
                renderPlayerCard(player, clanB.color, userClan === 'clan_b')
              )}
            </View>
          </View>
        </View>

        {/* Match Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Match Details</Text>
          </View>
          
          <View style={styles.matchDetailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tournament:</Text>
              <Text style={styles.detailValue}>{matchDetails.tournament}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Format:</Text>
              <Text style={styles.detailValue}>{matchDetails.format}</Text>
            </View>
            
            {matchDetails.map && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Map:</Text>
                <Text style={styles.detailValue}>{matchDetails.map}</Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Start Time:</Text>
              <Text style={styles.detailValue}>
                {new Date(matchDetails.startTime).toLocaleString()}
              </Text>
            </View>
            
            {matchDetails.duration && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Duration:</Text>
                <Text style={styles.detailValue}>{matchDetails.duration}</Text>
              </View>
            )}

            <View style={styles.rulesContainer}>
              <Text style={styles.rulesTitle}>Match Rules:</Text>
              {matchDetails.rules.map((rule, index) => (
                <Text key={index} style={styles.ruleItem}>• {rule}</Text>
              ))}
            </View>
          </View>
        </View>

        {/* Score Submission (Captain Only) */}
        {isCaptain && matchStatus === 'ongoing' && (
          <View style={styles.scoreActions}>
            <TouchableOpacity 
              style={[styles.scoreButton, isLoading && styles.scoreButtonDisabled]}
              onPress={handleScoreSubmission}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Flag size={16} color="#FFFFFF" />
              )}
              <Text style={[
                styles.scoreButtonText,
                isLoading && styles.scoreButtonTextDisabled
              ]}>
                {isLoading ? 'Submitting...' : 'Submit Score'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Real-time Chat */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Match Chat</Text>
            <MessageCircle size={16} color={colors.primary} />
          </View>
        </View>
      </ScrollView>

      {/* Chat Container */}
      <View style={styles.chatContainer}>
        <ScrollView style={styles.chatMessages} showsVerticalScrollIndicator={false}>
          {chatMessages.map(renderChatMessage)}
        </ScrollView>
        
        <View style={styles.chatInput}>
          <TextInput
            style={styles.chatTextInput}
            placeholder="Type a message..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={chatMessage}
            onChangeText={setChatMessage}
            multiline
            maxLength={200}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !chatMessage.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!chatMessage.trim()}
          >
            <Send size={16} color={chatMessage.trim() ? "#FFFFFF" : colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}