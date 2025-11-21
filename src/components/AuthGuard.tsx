import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * AuthGuard component to protect routes based on authentication status
 * 
 * @param children - The component(s) to render if access is granted
 * @param redirectTo - Where to redirect if access is denied (default: "/auth" for protected routes, "/" for guest routes)
 * @param requireAuth - Whether authentication is required (default: true)
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  redirectTo, 
  requireAuth = true 
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated();

    if (requireAuth && !isAuthenticated) {
      // User needs to be authenticated but isn't
      toast.error("Please log in to access this page");
      navigate(redirectTo || "/auth");
      return;
    }

    if (!requireAuth && isAuthenticated) {
      // User shouldn't be authenticated but is (e.g., accessing login page when already logged in)
      navigate(redirectTo || "/dashboard/properties");
      return;
    }
  }, [navigate, redirectTo, requireAuth]);

  // Render children if auth requirements are met
  const isAuthenticated = authService.isAuthenticated();
  
  if (requireAuth && !isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  if (!requireAuth && isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
};

/**
 * ProtectedRoute - Shorthand for routes that require authentication
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthGuard requireAuth={true}>
      {children}
    </AuthGuard>
  );
};

/**
 * GuestRoute - Shorthand for routes that should only be accessible to non-authenticated users
 */
export const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthGuard requireAuth={false}>
      {children}
    </AuthGuard>
  );
};

export default AuthGuard;