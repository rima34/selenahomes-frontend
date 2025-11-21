export interface PropertyType {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyTypeRequest {
  name: string;
  description?: string;
}

export interface UpdatePropertyTypeRequest {
  name?: string;
  description?: string;
}

export interface PropertyTypeFilter {
  name?: string;
}

export interface PropertyTypeOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface PropertyTypePaginatedResponse {
  results: PropertyType[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  propertyTypes: string[] | PropertyType[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  propertyTypes?: string[];
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  propertyTypes?: string[];
}

export interface CategoryFilter {
  name?: string;
  propertyTypes?: string[];
}

export interface CategoryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface CategoryPaginatedResponse {
  results: Category[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}
