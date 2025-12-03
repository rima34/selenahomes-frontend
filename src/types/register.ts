export enum ProfileType {
  FIRST_TIME_BUYER = "First-Time Buyer",
  BROKER_AGENT = "Broker/Agent",
  INVESTOR = "Investor",
}

export interface PropertyInfo {
  id: string;
  name: string;
  description: string;
  images: string[];
  status: string;
  price: number;
  sizeArea: string;
  locationIframe: string;
  handoverBy: string;
  paymentPlan: string;
  completionDate: string;
  propertyTypes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Register {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profileType: ProfileType;
  propertyId?: string | PropertyInfo;
  availabilityTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewRegister {
  fullName: string;
  email: string;
  phoneNumber: string;
  profileType: ProfileType;
  propertyId?: string;
}

export interface UpdateRegister {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  profileType?: ProfileType;
  propertyId?: string;
}

export interface RegisterFilter {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  profileType?: ProfileType;
}

export interface RegisterQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}
