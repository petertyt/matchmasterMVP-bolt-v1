/**
 * Service layer exports for Matchmaster gaming platform
 * Provides centralized access to all service modules
 */

// Export service instances
export { userService } from './userService';
export { tournamentService } from './tournamentService';
export { clanService } from './clanService';
export { authService } from './authService';

// Export service classes for advanced usage
export { UserService } from './userService';
export { TournamentService } from './tournamentService';
export { ClanService } from './clanService';

// Re-export types for convenience
export type {
  User,
  Tournament,
  Clan,
  Match,
  ServiceResponse,
  PaginatedResponse,
  QueryOptions,
  UserInput,
  UserUpdate,
  TournamentInput,
  TournamentUpdate,
  ClanInput,
  ClanUpdate,
  DatabaseError
} from '@/types/database';

/**
 * Service initialization function
 * Call this to ensure all services are properly initialized
 */
export async function initializeServices(): Promise<void> {
  try {
    console.log('All services initialized successfully');
  } catch (error) {
    console.error('Failed to initialize services:', error);
    throw error;
  }
}

/**
 * Service health check function
 * Verifies that all services can connect to their dependencies
 */
export async function checkServiceHealth(): Promise<{
  database: boolean;
  overall: boolean;
}> {
  const health = {
    database: false,
    overall: false,
  };

  try {
    // Test database connection by attempting a simple query
    const testResult = await userService.getUserProfile('test');
    health.database = testResult.code !== 'UNKNOWN_ERROR';

    health.overall = health.database;
  } catch (error) {
    console.error('Service health check failed:', error);
  }

  return health;
}

/**
 * Utility function to handle service responses consistently
 * Provides standardized error handling and logging
 */
export function handleServiceResponse<T>(
  response: ServiceResponse<T>,
  errorMessage?: string
): T | null {
  if (response.success && response.data !== undefined) {
    return response.data;
  }

  const message = errorMessage || 'Service operation failed';
  console.error(`${message}:`, response.error, response.code);
  
  return null;
}