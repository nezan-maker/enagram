import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

interface RoleRouteProps {
  children: React.ReactNode;
  roles: string[];
  fallbackPath?: string;
}

/**
 * Redirects users without the required role to the fallback path.
 * If no fallback is specified, redirects to the appropriate dashboard
 * based on the user's actual role.
 */
export const RoleRoute = ({ children, roles, fallbackPath }: RoleRouteProps) => {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role as string | undefined;

  if (!userRole || !roles.includes(userRole)) {
    // Redirect to role-appropriate dashboard or provided fallback
    if (fallbackPath) {
      return <Navigate to={fallbackPath} replace />;
    }

    // Role-based fallback routing
    const roleDashboards: Record<string, string> = {
      OWNER: '/owner/dashboard',
      DEPUTY_MANAGER: '/staff/deputy/dashboard',
      HR_MANAGER: '/staff/hr/dashboard',
      FINANCE_MANAGER: '/staff/finance/dashboard',
      KITCHEN_MANAGER: '/staff/kitchen/dashboard',
      CHEF: '/staff/chef/board',
      WAITER: '/staff/waiter/board',
      CLIENT: '/client/dashboard',
    };

    const fallback = roleDashboards[userRole || ''] || '/';
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};
