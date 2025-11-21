// Base service class to handle authentication for all API services
import { authService, RefreshTokenResponse } from "./authService";

export class BaseApiService {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Helper method to get authorization headers
  protected getAuthHeaders(): HeadersInit {
    const token = authService.getToken();
    return token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : {
          "Content-Type": "application/json",
        };
  }

  // Helper method to create headers for FormData requests
  protected getFormDataHeaders(): HeadersInit {
    const token = authService.getToken();
    return token
      ? {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        }
      : {};
  }

  // Helper method to handle authentication errors and token refresh
  protected async handleAuthError(response: Response): Promise<boolean> {
    if (response.status === 401) {
      // Check if we have a valid refresh token
      if (authService.isRefreshTokenValid()) {
        try {
          // Try to refresh the token
          const refreshResponse: RefreshTokenResponse =
            await authService.refreshToken();

          // Update stored tokens with new data
          authService.setAuthData({
            user: refreshResponse.user,
            tokens: refreshResponse.tokens,
          });

          return true; // Token refreshed successfully
        } catch (error) {
          authService.clearAuthData();
        }
      } else {
        // Refresh token is invalid or expired
        authService.clearAuthData();
      }
    }
    return false; // Authentication failed, user needs to log in
  }

  // Enhanced fetch method with automatic token refresh
  protected async authenticatedFetch(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const makeRequest = async (
      headers: HeadersInit = {}
    ): Promise<Response> => {
      return fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });
    };

    // Check if user is authenticated for protected operations
    const isProtectedMethod = ["POST", "PUT", "DELETE", "PATCH"].includes(
      (options.method || "GET").toUpperCase()
    );

    if (isProtectedMethod && !authService.isAuthenticated()) {
      throw new Error("Authentication required. Please log in.");
    }

    // Make initial request
    let response = await makeRequest(
      options.body instanceof FormData
        ? this.getFormDataHeaders()
        : this.getAuthHeaders()
    );

    // Try to refresh token if authentication failed
    if (response.status === 401 && isProtectedMethod) {
      const tokenRefreshed = await this.handleAuthError(response);
      if (tokenRefreshed) {
        // Retry with new token
        response = await makeRequest(
          options.body instanceof FormData
            ? this.getFormDataHeaders()
            : this.getAuthHeaders()
        );
      }
    }

    return response;
  }

  // Helper method to handle common API errors
  protected async handleApiError(response: Response): Promise<never> {
    const errorData = await response.json().catch(() => ({}));

    switch (response.status) {
      case 401:
        throw new Error("Authentication failed. Please log in again.");
      case 403:
        throw new Error("You do not have permission to perform this action.");
      case 404:
        throw new Error("Resource not found.");
      case 422:
        throw new Error(errorData.message || "Validation error occurred.");
      case 500:
        throw new Error("Server error occurred. Please try again later.");
      default:
        throw new Error(
          errorData.message || `Request failed: ${response.statusText}`
        );
    }
  }

  // Utility method to check authentication status
  protected requireAuth(): void {
    if (!authService.isAuthenticated()) {
      throw new Error("Authentication required. Please log in.");
    }
  }
}
