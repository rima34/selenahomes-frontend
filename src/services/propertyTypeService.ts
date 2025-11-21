import { BaseApiService } from "./baseApiService";
import type {
  PropertyType,
  CreatePropertyTypeRequest,
  UpdatePropertyTypeRequest,
  PropertyTypeFilter,
  PropertyTypeOptions,
  PropertyTypePaginatedResponse,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryFilter,
  CategoryOptions,
  CategoryPaginatedResponse,
} from "../types/property-type";

class PropertyTypeService extends BaseApiService {
  constructor() {
    super(import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api");
  }

  // Get all property types with filtering and pagination
  async getPropertyTypes(
    filter: PropertyTypeFilter = {},
    options: PropertyTypeOptions = {}
  ): Promise<PropertyTypePaginatedResponse> {
    // Build query string with options and filter as JSON
    const params = new URLSearchParams();
    if (Object.keys(options).length > 0) {
      params.append("options", JSON.stringify(options));
    }
    if (Object.keys(filter).length > 0) {
      params.append("filter", JSON.stringify(filter));
    }
    const url = `/property-types${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (await this.handleAuthError(response)) {
        // Retry the request with new token
        return this.getPropertyTypes(filter, options);
      }
      throw new Error(`Failed to fetch property types: ${response.statusText}`);
    }

    return response.json();
  }

  // Get a single property type by ID
  async getPropertyType(id: string): Promise<PropertyType> {
    const response = await fetch(`${this.baseUrl}/property-types/${id}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (await this.handleAuthError(response)) {
        // Retry the request with new token
        return this.getPropertyType(id);
      }
      throw new Error(`Failed to fetch property type: ${response.statusText}`);
    }

    return response.json();
  }

  // Create a new property type
  async createPropertyType(
    data: CreatePropertyTypeRequest
  ): Promise<PropertyType> {
    const response = await fetch(`${this.baseUrl}/property-types`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (await this.handleAuthError(response)) {
        // Retry the request with new token
        return this.createPropertyType(data);
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to create property type: ${response.statusText}`
      );
    }

    return response.json();
  }

  // Update a property type
  async updatePropertyType(
    id: string,
    data: UpdatePropertyTypeRequest
  ): Promise<PropertyType> {
    const response = await fetch(`${this.baseUrl}/property-types/${id}`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (await this.handleAuthError(response)) {
        // Retry the request with new token
        return this.updatePropertyType(id, data);
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to update property type: ${response.statusText}`
      );
    }

    return response.json();
  }

  // Delete a property type
  async deletePropertyType(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/property-types/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (await this.handleAuthError(response)) {
        // Retry the request with new token
        return this.deletePropertyType(id);
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to delete property type: ${response.statusText}`
      );
    }
  }

  // Get all categories with filtering and pagination
  async getCategories(
    filter: CategoryFilter = {},
    options: CategoryOptions = {}
  ): Promise<CategoryPaginatedResponse> {
    // Build query string with options and filter as JSON
    const params = new URLSearchParams();
    if (Object.keys(options).length > 0) {
      params.append("options", JSON.stringify(options));
    }
    if (Object.keys(filter).length > 0) {
      params.append("filter", JSON.stringify(filter));
    }
    const url = `/categories${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (await this.handleAuthError(response)) {
        // Retry the request with new token
        return this.getCategories(filter, options);
      }
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return response.json();
  }

  // Get a single category by ID
  async getCategory(id: string): Promise<Category> {
    const response = await fetch(`${this.baseUrl}/categories/${id}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (await this.handleAuthError(response)) {
        // Retry the request with new token
        return this.getCategory(id);
      }
      throw new Error(`Failed to fetch category: ${response.statusText}`);
    }

    return response.json();
  }

  // Create a new category
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await fetch(`${this.baseUrl}/categories`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (await this.handleAuthError(response)) {
        // Retry the request with new token
        return this.createCategory(data);
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create category: ${response.statusText}`
      );
    }

    return response.json();
  }

  // Update a category
  async updateCategory(
    id: string,
    data: UpdateCategoryRequest
  ): Promise<Category> {
    const response = await fetch(`${this.baseUrl}/categories/${id}`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (await this.handleAuthError(response)) {
        // Retry the request with new token
        return this.updateCategory(id, data);
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to update category: ${response.statusText}`
      );
    }

    return response.json();
  }

  // Delete a category
  async deleteCategory(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/categories/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (await this.handleAuthError(response)) {
        // Retry the request with new token
        return this.deleteCategory(id);
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to delete category: ${response.statusText}`
      );
    }
  }
}

export const propertyTypeService = new PropertyTypeService();
