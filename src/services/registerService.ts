import { BaseApiService } from "./baseApiService";
import {
  Register,
  NewRegister,
  UpdateRegister,
  RegisterFilter,
  RegisterQueryOptions,
} from "@/types/register";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/v1";

interface PaginatedResponse<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

class RegisterService extends BaseApiService {
  constructor() {
    super(API_BASE_URL);
  }

  /**
   * Create a new registration (Public - no auth required)
   */
  async createRegister(data: NewRegister): Promise<Register> {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await this.handleApiError(response);
    }

    return response.json();
  }

  /**
   * Get all registrations (Protected - requires authentication)
   */
  async getRegisters(
    filter?: RegisterFilter,
    options?: RegisterQueryOptions
  ): Promise<PaginatedResponse<Register>> {
    const queryParams = new URLSearchParams();

    // Add filter parameters
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, String(value));
        }
      });
    }

    // Add pagination and sorting options
    if (options) {
      if (options.page) queryParams.append("page", String(options.page));
      if (options.limit) queryParams.append("limit", String(options.limit));
      if (options.sortBy) queryParams.append("sortBy", options.sortBy);
      if (options.order) queryParams.append("order", options.order);
    }

    const url = `${this.baseUrl}/register${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await this.authenticatedFetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      await this.handleApiError(response);
    }

    return response.json();
  }

  /**
   * Get a single registration by ID (Protected - requires authentication)
   */
  async getRegister(registerId: string): Promise<Register> {
    const response = await this.authenticatedFetch(
      `${this.baseUrl}/register/${registerId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      await this.handleApiError(response);
    }

    return response.json();
  }

  /**
   * Update a registration (Protected - requires authentication)
   */
  async updateRegister(
    registerId: string,
    data: UpdateRegister
  ): Promise<Register> {
    const response = await this.authenticatedFetch(
      `${this.baseUrl}/register/${registerId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      await this.handleApiError(response);
    }

    return response.json();
  }

  /**
   * Delete a registration (Protected - requires authentication)
   */
  async deleteRegister(registerId: string): Promise<void> {
    const response = await this.authenticatedFetch(
      `${this.baseUrl}/register/${registerId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      await this.handleApiError(response);
    }
  }
}

export const registerService = new RegisterService();
