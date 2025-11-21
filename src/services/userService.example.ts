// Example: User service extending BaseApiService
import { BaseApiService } from "./baseApiService";
import { User } from "./authService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export interface UserUpdateData {
  name?: string;
  email?: string;
  // Add other updateable fields
}

class UserService extends BaseApiService {
  constructor() {
    super(`${API_BASE_URL}/users`);
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    this.requireAuth();

    const response = await this.authenticatedFetch(`${this.baseUrl}/me`);

    if (!response.ok) {
      await this.handleApiError(response);
    }

    return await response.json();
  }

  // Update user profile
  async updateProfile(userData: UserUpdateData): Promise<User> {
    this.requireAuth();

    const response = await this.authenticatedFetch(`${this.baseUrl}/me`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      await this.handleApiError(response);
    }

    return await response.json();
  }

  // Upload user avatar
  async uploadAvatar(avatarFile: File): Promise<User> {
    this.requireAuth();

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const response = await this.authenticatedFetch(
      `${this.baseUrl}/me/avatar`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      await this.handleApiError(response);
    }

    return await response.json();
  }

  // Delete user account
  async deleteAccount(): Promise<void> {
    this.requireAuth();

    const response = await this.authenticatedFetch(`${this.baseUrl}/me`, {
      method: "DELETE",
    });

    if (!response.ok) {
      await this.handleApiError(response);
    }
  }
}

export const userService = new UserService();
export default userService;
