import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, Users, Trophy, Search, Filter, Ban, UserCheck, CreditCard as Edit3, Trash2, Eye, TriangleAlert as AlertTriangle, Clock, TrendingUp, Award, Crown, X, Check, FileText, Calendar, ChevronDown, Lock, Clock as Unlock } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Grid, Typography, ComponentSpecs } from '@/constants/DesignSystem';
import { adminService } from '@/services/adminService';
import type { 
  AdminUser, 
  AdminTournament, 
  AdminLog, 
  AdminStats, 
  AdminFilters,
  UserRole,
  MatchResult
} from '@/types/admin';
import type { PaginatedResponse } from '@/types/database';

export default function AdminPanelScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'tournaments' | 'logs'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [actionType, setActionType] = useState<string>('');
  const [actionReason, setActionReason] = useState('');

  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<PaginatedResponse<AdminUser> | null>(null);
  const [tournaments, setTournaments] = useState<PaginatedResponse<AdminTournament> | null>(null);
  const [logs, setLogs] = useState<PaginatedResponse<AdminLog> | null>(null);

  // Filter states
  const [filters, setFilters] = useState<AdminFilters>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Mock admin user ID - in real app, get from auth context
  const adminUserId = 'admin-123';

  useEffect(() => {
    loadData();
  }, [activeTab, currentPage, filters]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'dashboard':
          await loadStats();
          break;
        case 'users':
          await loadUsers();
          break;
        case 'tournaments':
          await loadTournaments();
          break;
        case 'logs':
          await loadLogs();
          break;
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    const result = await adminService.getAdminStats();
    if (result.success) {
      setStats(result.data);
    }
  };

  const loadUsers = async () => {
    const result = await adminService.getAllUsers(
      { ...filters, search: searchQuery },
      { page: currentPage, limit: 20 }
    );
    if (result.success) {
      setUsers(result.data);
    }
  };

  const loadTournaments = async () => {
    const result = await adminService.getAllTournaments(
      { ...filters, search: searchQuery },
      { page: currentPage, limit: 20 }
    );
    if (result.success) {
      setTournaments(result.data);
    }
  };

  const loadLogs = async () => {
    const result = await adminService.getAdminLogs(
      { ...filters, search: searchQuery },
      { page: currentPage, limit: 50 }
    );
    if (result.success) {
      setLogs(result.data);
    }
  };

  const handleAction = async (type: string, item: any) => {
    setActionType(type);
    setSelectedItem(item);
    setActionReason('');
    setShowActionModal(true);
  };

  const executeAction = async () => {
    if (!selectedItem || !actionType) return;

    setIsLoading(true);
    try {
      let result;
      
      switch (actionType) {
        case 'ban':
          result = await adminService.banUser(adminUserId, selectedItem.id, actionReason);
          break;
        case 'unban':
          result = await adminService.unbanUser(adminUserId, selectedItem.id, actionReason);
          break;
        case 'delete_tournament':
          result = await adminService.removeTournament(adminUserId, selectedItem.id, actionReason);
          break;
        case 'assign_role':
          // This would need additional UI for role selection
          break;
        default:
          return;
      }

      if (result?.success) {
        Alert.alert('Success', 'Action completed successfully');
        setShowActionModal(false);
        loadData();
      } else {
        Alert.alert('Error', result?.error || 'Action failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to execute action');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return colors.error;
      case 'organizer':
        return colors.warning;
      case 'leader':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'banned':
        return colors.error;
      case 'suspended':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const renderDashboard = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Admin Dashboard</Text>
      
      {stats && (
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary + '20' }]}>
              <Users size={24} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{stats.total_users}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
            <Text style={styles.statSubtext}>{stats.active_users} active</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.warning + '20' }]}>
              <Trophy size={24} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>{stats.total_tournaments}</Text>
            <Text style={styles.statLabel}>Tournaments</Text>
            <Text style={styles.statSubtext}>{stats.active_tournaments} active</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.success + '20' }]}>
              <Shield size={24} color={colors.success} />
            </View>
            <Text style={styles.statValue}>{stats.total_clans}</Text>
            <Text style={styles.statLabel}>Total Clans</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.error + '20' }]}>
              <AlertTriangle size={24} color={colors.error} />
            </View>
            <Text style={styles.statValue}>{stats.banned_users}</Text>
            <Text style={styles.statLabel}>Banned Users</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.accent + '20' }]}>
              <Clock size={24} color={colors.accent} />
            </View>
            <Text style={styles.statValue}>{stats.recent_actions}</Text>
            <Text style={styles.statLabel}>Recent Actions</Text>
            <Text style={styles.statSubtext}>Last 24h</Text>
          </View>
        </View>
      )}

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setActiveTab('users')}
          >
            <Users size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Manage Users</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setActiveTab('tournaments')}
          >
            <Trophy size={20} color={colors.warning} />
            <Text style={styles.actionButtonText}>Manage Tournaments</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setActiveTab('logs')}
          >
            <FileText size={20} color={colors.accent} />
            <Text style={styles.actionButtonText}>View Logs</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderUsers = () => (
    <View style={styles.content}>
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>User Management</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterTitle}>Filters</Text>
          {/* Add filter controls here */}
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {users?.data.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {user.display_name.charAt(0).toUpperCase()}
                </Text>
              </View>
              
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.display_name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                
                <View style={styles.userMeta}>
                  <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) + '20' }]}>
                    <Text style={[styles.roleBadgeText, { color: getRoleColor(user.role) }]}>
                      {user.role.toUpperCase()}
                    </Text>
                  </View>
                  
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) + '20' }]}>
                    <Text style={[styles.statusBadgeText, { color: getStatusColor(user.status) }]}>
                      {user.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {user.clan_name && (
                  <Text style={styles.userClan}>Clan: {user.clan_name}</Text>
                )}
              </View>
            </View>

            <View style={styles.userActions}>
              {user.status === 'active' ? (
                <TouchableOpacity 
                  style={[styles.actionIcon, styles.banAction]}
                  onPress={() => handleAction('ban', user)}
                >
                  <Ban size={16} color={colors.error} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[styles.actionIcon, styles.unbanAction]}
                  onPress={() => handleAction('unban', user)}
                >
                  <UserCheck size={16} color={colors.success} />
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.actionIcon}
                onPress={() => handleAction('view', user)}
              >
                <Eye size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderTournaments = () => (
    <View style={styles.content}>
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Tournament Management</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {tournaments?.data.map((tournament) => (
          <View key={tournament.id} style={styles.tournamentCard}>
            <View style={styles.tournamentInfo}>
              <Text style={styles.tournamentName}>{tournament.name}</Text>
              <Text style={styles.tournamentCreator}>
                Created by: {tournament.creator_name}
              </Text>
              
              <View style={styles.tournamentMeta}>
                <Text style={styles.tournamentParticipants}>
                  {tournament.participants_count}/{tournament.max_participants} participants
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tournament.status) + '20' }]}>
                  <Text style={[styles.statusBadgeText, { color: getStatusColor(tournament.status) }]}>
                    {tournament.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={styles.tournamentDate}>
                Start: {new Date(tournament.start_date).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.tournamentActions}>
              <TouchableOpacity 
                style={styles.actionIcon}
                onPress={() => handleAction('edit', tournament)}
              >
                <Edit3 size={16} color={colors.primary} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionIcon, styles.deleteAction]}
                onPress={() => handleAction('delete_tournament', tournament)}
              >
                <Trash2 size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderLogs = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Admin Activity Logs</Text>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {logs?.data.map((log) => (
          <View key={log.id} style={styles.logCard}>
            <View style={styles.logHeader}>
              <Text style={styles.logAction}>{log.action.replace('_', ' ').toUpperCase()}</Text>
              <Text style={styles.logTime}>
                {new Date(log.timestamp).toLocaleString()}
              </Text>
            </View>
            
            <Text style={styles.logDetails}>
              {log.admin_name} performed {log.action.replace('_', ' ')} on {log.target_type} "{log.target_name}"
            </Text>
            
            {log.reason && (
              <Text style={styles.logReason}>Reason: {log.reason}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderActionModal = () => (
    <Modal visible={showActionModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Confirm {actionType.replace('_', ' ').toUpperCase()}
            </Text>
            <TouchableOpacity onPress={() => setShowActionModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalDescription}>
            Are you sure you want to {actionType.replace('_', ' ')} {selectedItem?.display_name || selectedItem?.name}?
          </Text>

          <TextInput
            style={styles.reasonInput}
            placeholder="Reason (optional)"
            placeholderTextColor={colors.textSecondary}
            value={actionReason}
            onChangeText={setActionReason}
            multiline
          />

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowActionModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={executeAction}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Grid.xl,
      paddingVertical: Grid.lg,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      ...Typography.headlineSmall,
      color: colors.text,
    },
    adminBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.error + '20',
      paddingHorizontal: Grid.sm,
      paddingVertical: Grid.xs,
      borderRadius: ComponentSpecs.button.borderRadius,
      gap: Grid.xs,
    },
    adminBadgeText: {
      ...Typography.labelSmall,
      color: colors.error,
      textTransform: 'uppercase',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: ComponentSpecs.input.borderRadius,
      paddingHorizontal: Grid.md,
      paddingVertical: Grid.sm,
      marginHorizontal: Grid.xl,
      marginVertical: Grid.md,
      borderWidth: 1,
      borderColor: colors.border,
      gap: Grid.sm,
    },
    searchInput: {
      flex: 1,
      ...Typography.bodyMedium,
      color: colors.text,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: Grid.md,
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
      padding: Grid.xl,
    },
    sectionTitle: {
      ...Typography.titleLarge,
      color: colors.text,
      marginBottom: Grid.lg,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Grid.md,
      marginBottom: Grid.xxxl,
    },
    statCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: colors.card,
      borderRadius: ComponentSpecs.card.borderRadius,
      padding: Grid.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    statIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Grid.sm,
    },
    statValue: {
      ...Typography.headlineMedium,
      color: colors.text,
      marginBottom: Grid.xs,
    },
    statLabel: {
      ...Typography.bodyMedium,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    statSubtext: {
      ...Typography.bodySmall,
      color: colors.textTertiary,
      marginTop: Grid.xs,
    },
    quickActions: {
      marginTop: Grid.xl,
    },
    actionGrid: {
      flexDirection: 'row',
      gap: Grid.md,
    },
    actionButton: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: ComponentSpecs.card.borderRadius,
      padding: Grid.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      gap: Grid.sm,
    },
    actionButtonText: {
      ...Typography.labelMedium,
      color: colors.text,
      textAlign: 'center',
    },
    listHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Grid.lg,
    },
    filterButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    filtersContainer: {
      backgroundColor: colors.surface,
      borderRadius: ComponentSpecs.card.borderRadius,
      padding: Grid.lg,
      marginBottom: Grid.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterTitle: {
      ...Typography.titleSmall,
      color: colors.text,
      marginBottom: Grid.md,
    },
    userCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: ComponentSpecs.card.borderRadius,
      padding: Grid.lg,
      marginBottom: Grid.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    userAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Grid.md,
    },
    userAvatarText: {
      ...Typography.titleSmall,
      color: '#FFFFFF',
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      ...Typography.titleSmall,
      color: colors.text,
      marginBottom: Grid.xs,
    },
    userEmail: {
      ...Typography.bodySmall,
      color: colors.textSecondary,
      marginBottom: Grid.sm,
    },
    userMeta: {
      flexDirection: 'row',
      gap: Grid.sm,
      marginBottom: Grid.xs,
    },
    roleBadge: {
      paddingHorizontal: Grid.sm,
      paddingVertical: Grid.xs,
      borderRadius: ComponentSpecs.button.borderRadius,
    },
    roleBadgeText: {
      ...Typography.labelSmall,
      fontWeight: '600',
    },
    statusBadge: {
      paddingHorizontal: Grid.sm,
      paddingVertical: Grid.xs,
      borderRadius: ComponentSpecs.button.borderRadius,
    },
    statusBadgeText: {
      ...Typography.labelSmall,
      fontWeight: '600',
    },
    userClan: {
      ...Typography.bodySmall,
      color: colors.textTertiary,
    },
    userActions: {
      flexDirection: 'row',
      gap: Grid.sm,
    },
    actionIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    banAction: {
      backgroundColor: colors.error + '10',
      borderColor: colors.error + '30',
    },
    unbanAction: {
      backgroundColor: colors.success + '10',
      borderColor: colors.success + '30',
    },
    deleteAction: {
      backgroundColor: colors.error + '10',
      borderColor: colors.error + '30',
    },
    tournamentCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: ComponentSpecs.card.borderRadius,
      padding: Grid.lg,
      marginBottom: Grid.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tournamentInfo: {
      flex: 1,
    },
    tournamentName: {
      ...Typography.titleSmall,
      color: colors.text,
      marginBottom: Grid.xs,
    },
    tournamentCreator: {
      ...Typography.bodySmall,
      color: colors.textSecondary,
      marginBottom: Grid.sm,
    },
    tournamentMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Grid.sm,
      marginBottom: Grid.xs,
    },
    tournamentParticipants: {
      ...Typography.bodySmall,
      color: colors.textSecondary,
    },
    tournamentDate: {
      ...Typography.bodySmall,
      color: colors.textTertiary,
    },
    tournamentActions: {
      flexDirection: 'row',
      gap: Grid.sm,
    },
    logCard: {
      backgroundColor: colors.card,
      borderRadius: ComponentSpecs.card.borderRadius,
      padding: Grid.lg,
      marginBottom: Grid.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    logHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Grid.sm,
    },
    logAction: {
      ...Typography.labelLarge,
      color: colors.primary,
    },
    logTime: {
      ...Typography.bodySmall,
      color: colors.textSecondary,
    },
    logDetails: {
      ...Typography.bodyMedium,
      color: colors.text,
      marginBottom: Grid.sm,
    },
    logReason: {
      ...Typography.bodySmall,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: Grid.xl,
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: ComponentSpecs.card.borderRadius,
      padding: Grid.xl,
      width: '100%',
      maxWidth: 400,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Grid.lg,
    },
    modalTitle: {
      ...Typography.titleLarge,
      color: colors.text,
    },
    modalDescription: {
      ...Typography.bodyMedium,
      color: colors.textSecondary,
      marginBottom: Grid.lg,
      lineHeight: 20,
    },
    reasonInput: {
      backgroundColor: colors.surface,
      borderRadius: ComponentSpecs.input.borderRadius,
      padding: Grid.md,
      ...Typography.bodyMedium,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: Grid.lg,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    modalActions: {
      flexDirection: 'row',
      gap: Grid.md,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: ComponentSpecs.button.borderRadius,
      paddingVertical: Grid.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelButtonText: {
      ...Typography.labelLarge,
      color: colors.textSecondary,
    },
    confirmButton: {
      flex: 1,
      backgroundColor: colors.error,
      borderRadius: ComponentSpecs.button.borderRadius,
      paddingVertical: Grid.md,
      alignItems: 'center',
    },
    confirmButtonText: {
      ...Typography.labelLarge,
      color: '#FFFFFF',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <View style={styles.adminBadge}>
          <Lock size={16} color={colors.error} />
          <Text style={styles.adminBadgeText}>Admin Access</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users, tournaments..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {[
          { key: 'dashboard', label: 'Dashboard' },
          { key: 'users', label: 'Users' },
          { key: 'tournaments', label: 'Tournaments' },
          { key: 'logs', label: 'Logs' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => {
              setActiveTab(tab.key as any);
              setCurrentPage(1);
            }}
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
      {isLoading && activeTab !== 'dashboard' ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'tournaments' && renderTournaments()}
          {activeTab === 'logs' && renderLogs()}
        </>
      )}

      {/* Action Modal */}
      {renderActionModal()}
    </SafeAreaView>
  );
}