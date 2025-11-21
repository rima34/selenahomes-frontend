// Public route wrapper that redirects authenticated users away from auth pages
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthContext";
import { ReactNode } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const PublicRoute = ({ children, redirectTo = "/dashboard" }: PublicRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    // Redirect authenticated users away from auth pages
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;