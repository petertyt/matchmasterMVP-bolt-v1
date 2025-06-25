import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, Users, Crown, Shield, Star, TrendingUp, Award, ChevronRight, Settings, UserPlus, CreditCard as Edit3, X, Check, MoveVertical as MoreVertical } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, FontWeight, Spacing, BorderRadius } from '@/constants/Spacing';

interface ClanMember {
  id: string;
  username: string;
  role: 'leader' | 'officer' | 'member';
  joinDate: string;
  isOnline: boolean;
  avatar?: string;
}

interface Clan {
  id: string;
  name: string;
  tag: string;
  members: ClanMember[];
  maxMembers: number;
  level: number;
  wins: number;
  rank: number;
  leader: string;
  logo: string;
  description: string;
  isPublic: boolean;
}

interface ClanInvite {
  id: string;
  clanName: string;
  clanTag: string;
  invitedBy: string;
  date: string;
  logo: string;
}

interface AvailableClan {
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
  isPublic: boolean;
  requirements?: string;
}

export default function ClansScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'my-clan' | 'explore' | 'invites'>('my-clan');
  const [managementTab, setManagementTab] = useState<'members' | 'roles' | 'invites' | 'lineup'>('members');
  const [showManagementModal, setShowManagementModal] = useState(false);
  const [showCreateClanModal, setShowCreateClanModal] = useState(false);
  const [showJoinClanModal, setShowJoinClanModal] = useState(false);
  const [selectedClan, setSelectedClan] = useState<AvailableClan | null>(null);

  // Mock user clan membership - set to true to test clan member view
  const userClan: Clan | null = {
    id: '1',
    name: 'Thunder Bolts',
    tag: 'THDR',
    members: [
      {
        id: '1',
        username: 'StormKing',
        role: 'leader',
        joinDate: '2024-01-15',
        isOnline: true,
      },
      {
        id: '2',
        username: 'LightningStrike',
        role: 'officer',
        joinDate: '2024-01-20',
        isOnline: true,
      },
      {
        id: '3',
        username: 'ThunderBolt',
        role: 'member',
        joinDate: '2024-02-01',
        isOnline: false,
      },
      {
        id: '4',
        username: 'ElectricShock',
        role: 'member',
        joinDate: '2024-02-10',
        isOnline: true,
      },
    ],
    maxMembers: 20,
    level: 38,
    wins: 98,
    rank: 3,
    leader: 'StormKing',
    logo: '⚡',
    description: 'Elite competitive clan focused on tournament victories',
    isPublic: true,
  };

  const userRole = userClan?.members.find(m => m.username === 'ThunderBolt')?.role || 'member';

  const availableClans: AvailableClan[] = [
    {
      id: '2',
      name: 'Elite Warriors',
      tag: 'ELIT',
      members: 18,
      maxMembers: 20,
      level: 45,
      wins: 127,
      rank: 1,
      leader: 'DragonMaster',
      logo: '⚔️',
      isPublic: true,
      requirements: 'Min. Level 25',
    },
    {
      id: '3',
      name: 'Phoenix Rising',
      tag: 'PHNX',
      members: 12,
      maxMembers: 15,
      level: 42,
      wins: 113,
      rank: 2,
      leader: 'FireBird',
      logo: '🔥',
      isPublic: true,
    },
    {
      id: '4',
      name: 'Ice Guardians',
      tag: 'ICE',
      members: 20,
      maxMembers: 25,
      level: 35,
      wins: 89,
      rank: 5,
      leader: 'FrostLord',
      logo: '❄️',
      isPublic: false,
      requirements: 'Invitation Only',
    },
    {
      id: '5',
      name: 'Shadow Hunters',
      tag: 'SHDW',
      members: 8,
      maxMembers: 12,
      level: 28,
      wins: 67,
      rank: 8,
      leader: 'NightCrawler',
      logo: '🌙',
      isPublic: true,
    },
  ];

  const clanInvites: ClanInvite[] = [
    {
      id: '1',
      clanName: 'Elite Warriors',
      clanTag: 'ELIT',
      invitedBy: 'DragonMaster',
      date: '2025-01-10',
      logo: '⚔️',
    },
    {
      id: '2',
      clanName: 'Phoenix Rising',
      clanTag: 'PHNX',
      invitedBy: 'FireBird',
      date: '2025-01-08',
      logo: '🔥',
    },
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#FFD700'; // Gold
    if (rank === 2) return '#C0C0C0'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    return colors.textSecondary;
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return <Crown size={16} color={getRankColor(rank)} />;
    return <Award size={16} color={colors.textSecondary} />;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'leader':
        return '#FFD700';
      case 'officer':
        return '#7F5AF0';
      case 'member':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'leader':
        return <Crown size={14} color="#FFD700" />;
      case 'officer':
        return <Shield size={14} color="#7F5AF0" />;
      case 'member':
        return <Users size={14} color={colors.textSecondary} />;
      default:
        return <Users size={14} color={colors.textSecondary} />;
    }
  };

  const filteredClans = availableClans.filter((clan) =>
    clan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clan.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinClan = (clan: AvailableClan) => {
    if (!clan.isPublic) {
      Alert.alert('Private Clan', 'This clan requires an invitation to join.');
      return;
    }
    setSelectedClan(clan);
    setShowJoinClanModal(true);
  };

  const handleAcceptInvite = (invite: ClanInvite) => {
    Alert.alert(
      'Accept Invitation',
      `Join ${invite.clanName} [${invite.clanTag}]?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Accept', onPress: () => console.log('Accepted invite') },
      ]
    );
  };

  const handleDeclineInvite = (invite: ClanInvite) => {
    Alert.alert(
      'Decline Invitation',
      `Decline invitation from ${invite.clanName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Decline', style: 'destructive', onPress: () => console.log('Declined invite') },
      ]
    );
  };

  const renderMyClanView = () => {
    if (!userClan) {
      return (
        <View style={styles.emptyState}>
          <Shield size={64} color={colors.textSecondary} />
          <Text style={styles.emptyStateTitle}>No Clan Yet</Text>
          <Text style={styles.emptyStateText}>
            Join an existing clan or create your own to start competing with a team!
          </Text>
          <View style={styles.emptyStateActions}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setShowCreateClanModal(true)}
            >
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

    return (
      <View style={styles.myClanContainer}>
        {/* Clan Header */}
        <View style={styles.clanHeader}>
          <View style={styles.clanInfo}>
            <Text style={styles.clanLogo}>{userClan.logo}</Text>
            <View style={styles.clanDetails}>
              <View style={styles.clanNameRow}>
                <Text style={styles.clanName}>{userClan.name}</Text>
                <Text style={styles.clanTag}>[{userClan.tag}]</Text>
              </View>
              <View style={styles.clanRank}>
                {getRankIcon(userClan.rank)}
                <Text style={styles.rankText}>Rank #{userClan.rank}</Text>
              </View>
              <Text style={styles.clanDescription}>{userClan.description}</Text>
            </View>
          </View>
          
          {(userRole === 'leader' || userRole === 'officer') && (
            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => setShowManagementModal(true)}
            >
              <Settings size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Clan Stats */}
        <View style={styles.clanStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userClan.members.length}</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userClan.level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userClan.wins}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>#{userClan.rank}</Text>
            <Text style={styles.statLabel}>Rank</Text>
          </View>
        </View>

        {/* Recent Members */}
        <View style={styles.membersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Members</Text>
            <TouchableOpacity onPress={() => setShowManagementModal(true)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {userClan.members.slice(0, 4).map((member) => (
            <View key={member.id} style={styles.memberItem}>
              <View style={styles.memberInfo}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberAvatarText}>
                    {member.username.charAt(0).toUpperCase()}
                  </Text>
                  {member.isOnline && <View style={styles.onlineIndicator} />}
                </View>
                <View style={styles.memberDetails}>
                  <Text style={styles.memberName}>{member.username}</Text>
                  <View style={styles.memberRole}>
                    {getRoleIcon(member.role)}
                    <Text style={[styles.roleText, { color: getRoleColor(member.role) }]}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.joinDate}>
                {new Date(member.joinDate).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderExploreView = () => (
    <View style={styles.exploreContainer}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clans..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateClanModal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredClans.length === 0 ? (
          <View style={styles.emptyState}>
            <Users size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No clans found</Text>
          </View>
        ) : (
          filteredClans.map((clan) => (
            <TouchableOpacity key={clan.id} style={styles.clanCard}>
              <View style={styles.clanCardHeader}>
                <View style={styles.clanCardInfo}>
                  <Text style={styles.clanCardLogo}>{clan.logo}</Text>
                  <View style={styles.clanCardDetails}>
                    <View style={styles.clanCardNameRow}>
                      <Text style={styles.clanCardName}>{clan.name}</Text>
                      <Text style={styles.clanCardTag}>[{clan.tag}]</Text>
                    </View>
                    <View style={styles.clanCardRank}>
                      {getRankIcon(clan.rank)}
                      <Text style={styles.clanCardRankText}>#{clan.rank}</Text>
                      <Text style={styles.clanCardLeader}>Leader: {clan.leader}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.joinButton,
                    !clan.isPublic && styles.joinButtonDisabled,
                  ]}
                  onPress={() => handleJoinClan(clan)}
                  disabled={!clan.isPublic}
                >
                  <Text
                    style={[
                      styles.joinButtonText,
                      !clan.isPublic && styles.joinButtonTextDisabled,
                    ]}
                  >
                    {clan.isPublic ? 'Join' : 'Private'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.clanCardMeta}>
                <View style={styles.metaItem}>
                  <Users size={16} color={colors.textSecondary} />
                  <Text style={styles.metaText}>
                    {clan.members}/{clan.maxMembers}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Star size={16} color={colors.textSecondary} />
                  <Text style={styles.metaText}>Level {clan.level}</Text>
                </View>
                <View style={styles.metaItem}>
                  <TrendingUp size={16} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{clan.wins} wins</Text>
                </View>
              </View>

              {clan.requirements && (
                <Text style={styles.requirements}>{clan.requirements}</Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderInvitesView = () => (
    <View style={styles.invitesContainer}>
      {clanInvites.length === 0 ? (
        <View style={styles.emptyState}>
          <UserPlus size={48} color={colors.textSecondary} />
          <Text style={styles.emptyStateText}>No clan invitations</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {clanInvites.map((invite) => (
            <View key={invite.id} style={styles.inviteCard}>
              <View style={styles.inviteHeader}>
                <Text style={styles.inviteLogo}>{invite.logo}</Text>
                <View style={styles.inviteInfo}>
                  <Text style={styles.inviteClanName}>
                    {invite.clanName} [{invite.clanTag}]
                  </Text>
                  <Text style={styles.inviteDetails}>
                    Invited by {invite.invitedBy}
                  </Text>
                  <Text style={styles.inviteDate}>
                    {new Date(invite.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.inviteActions}>
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={() => handleDeclineInvite(invite)}
                >
                  <X size={16} color={colors.error} />
                  <Text style={styles.declineButtonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAcceptInvite(invite)}
                >
                  <Check size={16} color="#FFFFFF" />
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderManagementModal = () => (
    <Modal
      visible={showManagementModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Clan Management</Text>
          <TouchableOpacity onPress={() => setShowManagementModal(false)}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.managementTabs}>
          {['members', 'roles', 'invites', 'lineup'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.managementTab,
                managementTab === tab && styles.activeManagementTab,
              ]}
              onPress={() => setManagementTab(tab as any)}
            >
              <Text
                style={[
                  styles.managementTabText,
                  managementTab === tab && styles.activeManagementTabText,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.managementContent}>
          {managementTab === 'members' && userClan && (
            <View>
              {userClan.members.map((member) => (
                <View key={member.id} style={styles.managementMemberItem}>
                  <View style={styles.memberInfo}>
                    <View style={styles.memberAvatar}>
                      <Text style={styles.memberAvatarText}>
                        {member.username.charAt(0).toUpperCase()}
                      </Text>
                      {member.isOnline && <View style={styles.onlineIndicator} />}
                    </View>
                    <View style={styles.memberDetails}>
                      <Text style={styles.memberName}>{member.username}</Text>
                      <View style={styles.memberRole}>
                        {getRoleIcon(member.role)}
                        <Text style={[styles.roleText, { color: getRoleColor(member.role) }]}>
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {userRole === 'leader' && member.role !== 'leader' && (
                    <TouchableOpacity style={styles.memberActionButton}>
                      <MoreVertical size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: FontSize.xxl,
      fontFamily: 'Poppins-Bold',
      color: colors.text,
      marginBottom: Spacing.lg,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.xs,
    },
    tab: {
      flex: 1,
      paddingVertical: Spacing.sm,
      alignItems: 'center',
      borderRadius: BorderRadius.md,
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
    },
    activeTabText: {
      color: '#FFFFFF',
    },
    inactiveTabText: {
      color: colors.textSecondary,
    },
    content: {
      flex: 1,
    },
    myClanContainer: {
      padding: Spacing.xl,
    },
    clanHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    clanInfo: {
      flexDirection: 'row',
      flex: 1,
    },
    clanLogo: {
      fontSize: FontSize.xxxxl,
      marginRight: Spacing.md,
    },
    clanDetails: {
      flex: 1,
    },
    clanNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    clanName: {
      fontSize: FontSize.lg,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
      marginRight: Spacing.sm,
    },
    clanTag: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
    },
    clanRank: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      marginBottom: Spacing.sm,
    },
    rankText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    clanDescription: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 20,
    },
    manageButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    clanStats: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      fontSize: FontSize.xl,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: Spacing.xs,
    },
    statLabel: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    membersSection: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    sectionTitle: {
      fontSize: FontSize.lg,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
    },
    seeAllText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
    },
    memberItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    memberInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    memberAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
      position: 'relative',
    },
    memberAvatarText: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.accent,
      borderWidth: 2,
      borderColor: colors.card,
    },
    memberDetails: {
      flex: 1,
    },
    memberName: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: Spacing.xs,
    },
    memberRole: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    roleText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
    },
    joinDate: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    exploreContainer: {
      flex: 1,
      padding: Spacing.xl,
    },
    searchContainer: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginBottom: Spacing.lg,
    },
    searchInputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      marginLeft: Spacing.sm,
      fontSize: FontSize.base,
      fontFamily: 'Inter-Regular',
      color: colors.text,
    },
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      gap: Spacing.sm,
    },
    createButtonText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    clanCard: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    clanCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: Spacing.md,
    },
    clanCardInfo: {
      flexDirection: 'row',
      flex: 1,
      marginRight: Spacing.md,
    },
    clanCardLogo: {
      fontSize: FontSize.xxl,
      marginRight: Spacing.md,
    },
    clanCardDetails: {
      flex: 1,
    },
    clanCardNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    clanCardName: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginRight: Spacing.sm,
    },
    clanCardTag: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
    },
    clanCardRank: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    clanCardRankText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    clanCardLeader: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginLeft: Spacing.sm,
    },
    joinButton: {
      backgroundColor: colors.accent,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
    },
    joinButtonDisabled: {
      backgroundColor: colors.surface,
    },
    joinButtonText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    joinButtonTextDisabled: {
      color: colors.textSecondary,
    },
    clanCardMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Spacing.sm,
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
    requirements: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Medium',
      color: colors.warning,
      fontStyle: 'italic',
    },
    invitesContainer: {
      flex: 1,
      padding: Spacing.xl,
    },
    inviteCard: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inviteHeader: {
      flexDirection: 'row',
      marginBottom: Spacing.lg,
    },
    inviteLogo: {
      fontSize: FontSize.xxl,
      marginRight: Spacing.md,
    },
    inviteInfo: {
      flex: 1,
    },
    inviteClanName: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: Spacing.xs,
    },
    inviteDetails: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: Spacing.xs,
    },
    inviteDate: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    inviteActions: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    declineButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      gap: Spacing.xs,
    },
    declineButtonText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: colors.error,
    },
    acceptButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accent,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      gap: Spacing.xs,
    },
    acceptButtonText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Spacing.xxxxl,
    },
    emptyStateTitle: {
      fontSize: FontSize.lg,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
      marginTop: Spacing.md,
      marginBottom: Spacing.sm,
    },
    emptyStateText: {
      fontSize: FontSize.base,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: Spacing.xl,
      paddingHorizontal: Spacing.xl,
      lineHeight: 24,
    },
    emptyStateActions: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    primaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      gap: Spacing.sm,
    },
    primaryButtonText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    secondaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: colors.primary,
      gap: Spacing.sm,
    },
    secondaryButtonText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: colors.primary,
    },
    modalContainer: {
      flex: 1,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: FontSize.lg,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
    },
    managementTabs: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md,
      backgroundColor: colors.surface,
    },
    managementTab: {
      flex: 1,
      paddingVertical: Spacing.sm,
      alignItems: 'center',
      borderRadius: BorderRadius.md,
    },
    activeManagementTab: {
      backgroundColor: colors.primary,
    },
    managementTabText: {
      fontSize: FontSize.sm,
      fontFamily: 'Inter-SemiBold',
      color: colors.textSecondary,
    },
    activeManagementTabText: {
      color: '#FFFFFF',
    },
    managementContent: {
      flex: 1,
      paddingHorizontal: Spacing.xl,
    },
    managementMemberItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    memberActionButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clans</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'my-clan' && styles.activeTab]}
            onPress={() => setActiveTab('my-clan')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'my-clan' ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              My Clan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'explore' && styles.activeTab]}
            onPress={() => setActiveTab('explore')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'explore' ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              Explore
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'invites' && styles.activeTab]}
            onPress={() => setActiveTab('invites')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'invites' ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              Invites ({clanInvites.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {activeTab === 'my-clan' && renderMyClanView()}
        {activeTab === 'explore' && renderExploreView()}
        {activeTab === 'invites' && renderInvitesView()}
      </View>

      {renderManagementModal()}
    </SafeAreaView>
  );
}