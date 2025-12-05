import { PropertyType } from "./property-type";

export enum PropertyStatus {
  READY_TO_MOVE = "ready to move",
  OFF_PLAN = "off plan",
  FOR_RENT = "for rent",
}

export interface Property {
  id: string;
  name: string;
  description?: string;
  images?: string[];
  status: PropertyStatus;
  price: number;
  priceFrom?: number;
  priceTo?: number;
  sizeArea?: string | Record<string, unknown>; // Can be string or object from API
  size?: string | Record<string, unknown>; // Can be string or object from API
  sizeFrom?: string;
  sizeTo?: string;
  locationIframe?: string | Record<string, unknown>; // Can be string or object from API
  handoverBy?: string | Record<string, unknown>; // Can be string or object from API
  paymentPlan?: string;
  completionDate?: string;
  propertyTypes?: PropertyType[];
  beds?: number;
  baths?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IPropertyFilter {
  name?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}
