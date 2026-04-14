import { useAuth } from '../components/Admin/AuthContext';

/**
 * Convenience hook for admin dashboard components that need the backend JWT.
 * Reads the token already exchanged by AuthContext on login — no extra network call.
 *
 * @returns {{ backendToken: string|null, loading: boolean, error: string }}
 */
export function useAdminBackendToken() {
  const { backendToken, loading } = useAuth();
  return { backendToken, loading, error: '' };
}
