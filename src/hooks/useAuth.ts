import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService, { type User } from "@/services/authService";
import { toast } from "sonner";

export interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        setUserEmail(authService.getUserEmail());
        setUser(authService.getUserData());
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const credentials = { email, password };

    // Validate credentials
    const validationError = authService.validateLoginCredentials(credentials);
    if (validationError) {
      throw new Error(validationError);
    }

    setIsLoading(true);

    try {
      const data = await authService.login(credentials);

      // Store auth data
      authService.setAuthData(data);

      // Update state
      setIsAuthenticated(true);
      setUserEmail(email);
      setUser(data.user || null);

      toast.success("Login successful!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<void> => {
    const credentials = { email, password, confirmPassword };

    // Validate credentials
    const validationError = authService.validateSignupCredentials(credentials);
    if (validationError) {
      throw new Error(validationError);
    }

    setIsLoading(true);

    try {
      await authService.signup(credentials);
      toast.success("Account created successfully! Please log in.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();

      // Update state
      setIsAuthenticated(false);
      setUser(null);
      setUserEmail(null);

      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      authService.clearAuthData();
      setIsAuthenticated(false);
      setUser(null);
      setUserEmail(null);

      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  return {
    isAuthenticated,
    user,
    userEmail,
    login,
    signup,
    logout,
    isLoading,
  };
};

export default useAuth;
