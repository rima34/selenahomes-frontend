// Property service to handle all property-related API calls
import { Property } from "@/types/property";
import { BaseApiService } from "./baseApiService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export interface PropertyResponse {
  results?: Property[];
  property?: Property;
  message?: string;
}

export interface PropertyPaginatedResponse {
  results: Property[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface PropertyFilter {
  name?: string;
  status?: string;
  beds?: number;
  bedsGt?: number;
  baths?: number;
  bathsGt?: number;
  minPrice?: number;
  maxPrice?: number;
  minSizeArea?: number;
  maxSizeArea?: number;
  propertyTypes?: string[];
  completionDateFrom?: string;
  completionDateTo?: string;
}

export interface PropertyOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

// Utility function to get property image preview URL
export const getPropertyImageUrl = (imagePath: string): string => {
  return `${API_BASE_URL}/file/preview/property/${imagePath}`;
};

class PropertyService extends BaseApiService {
  constructor() {
    super(`${API_BASE_URL}/properties`);
  }

  // Get all properties (legacy method for backward compatibility)
  async getAllProperties(): Promise<Property[]> {
    const response = await this.authenticatedFetch(this.baseUrl);

    if (!response.ok) {
      await this.handleApiError(response);
    }

    const data: PropertyResponse = await response.json();
    return data.results || (data as Property[]);
  }

  async getProperties(
    filter: PropertyFilter = {},
    options: PropertyOptions = {}
  ): Promise<PropertyPaginatedResponse> {
    const params = new URLSearchParams();
    if (Object.keys(options).length > 0) {
      params.append("options", JSON.stringify(options));
    }
    if (Object.keys(filter).length > 0) {
      params.append("filter", JSON.stringify(filter));
    }
    const url = `${this.baseUrl}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await this.authenticatedFetch(url);

    if (!response.ok) {
      await this.handleApiError(response);
    }

    const data = await response.json();

    // Handle both paginated and non-paginated responses
    if (data.results && typeof data.page === "number") {
      return data as PropertyPaginatedResponse;
    } else {
      // Convert legacy response to paginated format
      const results = data.results || (Array.isArray(data) ? data : []);
      return {
        results,
        page: 1,
        limit: results.length,
        totalPages: 1,
        totalResults: results.length,
      };
    }
  }

  // Get a single property by ID
  async getPropertyById(id: string): Promise<Property> {
    const response = await this.authenticatedFetch(`${this.baseUrl}/${id}`);

    if (!response.ok) {
      await this.handleApiError(response);
    }

    const data: PropertyResponse = await response.json();
    return data.property || (data as Property);
  }

  // Create a new property
  async createProperty(propertyData: FormData): Promise<Property> {
    this.requireAuth();

    const response = await this.authenticatedFetch(this.baseUrl, {
      method: "POST",
      body: propertyData,
    });

    if (!response.ok) {
      await this.handleApiError(response);
    }

    const data: PropertyResponse = await response.json();
    return data.property || (data as Property);
  }

  // Update an existing property
  async updateProperty(id: string, propertyData: FormData): Promise<Property> {
    this.requireAuth();

    const response = await this.authenticatedFetch(`${this.baseUrl}/${id}`, {
      method: "PATCH",
      body: propertyData,
    });

    if (!response.ok) {
      await this.handleApiError(response);
    }

    const data: PropertyResponse = await response.json();
    return data.property || (data as Property);
  }

  // Delete a property
  async deleteProperty(id: string): Promise<void> {
    this.requireAuth();

    const response = await this.authenticatedFetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      await this.handleApiError(response);
    }
  }

  // Utility method to convert Property object to FormData
  static propertyToFormData(
    property: Partial<Property>,
    images?: FileList,
    replaceImages?: boolean
  ): FormData {
    const formData = new FormData();

    Object.entries(property).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        key !== "id" &&
        key !== "createdAt" &&
        key !== "updatedAt" &&
        key !== "images"
      ) {
        if (key === "completionDate" && value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Handle file uploads
    if (images && images.length > 0) {
      Array.from(images).forEach((file) => {
        formData.append("images", file);
      });

      // Add replaceImages flag when uploading new images
      if (replaceImages !== undefined) {
        formData.append("replaceImages", replaceImages.toString());
      }
    }

    return formData;
  }
}

export const propertyService = new PropertyService();
export default propertyService;
