// Auth service to handle all authentication-related API calls
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  confirmPassword: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TokenInfo {
  token: string;
  expires: string;
}

export interface Tokens {
  access: TokenInfo;
  refresh: TokenInfo;
}

export interface AuthResponse {
  user: User;
  tokens: Tokens;
  message?: string;
}

export interface RefreshTokenResponse {
  user: User;
  tokens: Tokens;
}

class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/auth`;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const { confirmPassword, ...signupData } = credentials;

    const response = await fetch(`${this.baseUrl}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    return data;
  }

  async logout(): Promise<void> {
    const token = this.getToken();

    if (token) {
      try {
        await fetch(`${this.baseUrl}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Logout API call failed:", error);
      }
    }

    // Clear local storage regardless of API call success
    this.clearAuthData();
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${this.baseUrl}/refreshTokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Token refresh failed");
    }

    return data;
  }

  // Token management methods
  setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem("accessToken", authResponse.tokens.access.token);
    localStorage.setItem("refreshToken", authResponse.tokens.refresh.token);
    localStorage.setItem(
      "accessTokenExpires",
      authResponse.tokens.access.expires
    );
    localStorage.setItem(
      "refreshTokenExpires",
      authResponse.tokens.refresh.expires
    );
    localStorage.setItem("userEmail", authResponse.user.email);
    localStorage.setItem("userData", JSON.stringify(authResponse.user));
  }

  getToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  getAccessTokenExpiry(): string | null {
    return localStorage.getItem("accessTokenExpires");
  }

  getRefreshTokenExpiry(): string | null {
    return localStorage.getItem("refreshTokenExpires");
  }

  getUserEmail(): string | null {
    return localStorage.getItem("userEmail");
  }

  getUserData(): User | null {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  }

  clearAuthData(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessTokenExpires");
    localStorage.removeItem("refreshTokenExpires");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userData");
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const expiry = this.getAccessTokenExpiry();

    if (!token || !expiry) {
      return false;
    }

    // Check if token is expired
    const expiryDate = new Date(expiry);
    const now = new Date();

    return expiryDate > now;
  }

  isRefreshTokenValid(): boolean {
    const refreshToken = this.getRefreshToken();
    const expiry = this.getRefreshTokenExpiry();

    if (!refreshToken || !expiry) {
      return false;
    }

    // Check if refresh token is expired
    const expiryDate = new Date(expiry);
    const now = new Date();

    return expiryDate > now;
  }

  // Utility method to validate credentials before making API calls
  validateLoginCredentials(credentials: LoginCredentials): string | null {
    if (!credentials.email || !credentials.password) {
      return "Please fill in all fields";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      return "Please enter a valid email address";
    }

    return null;
  }

  validateSignupCredentials(credentials: SignupCredentials): string | null {
    const loginValidation = this.validateLoginCredentials(credentials);
    if (loginValidation) return loginValidation;

    if (!credentials.confirmPassword) {
      return "Please confirm your password";
    }

    if (credentials.password !== credentials.confirmPassword) {
      return "Passwords do not match";
    }

    if (credentials.password.length < 6) {
      return "Password must be at least 6 characters long";
    }

    return null;
  }
}

// Export a singleton instance
export const authService = new AuthService();
export default authService;
