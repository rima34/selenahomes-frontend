export enum CallDirection {
  INBOUND = "INBOUND",
  OUTBOUND = "OUTBOUND",
}

export interface Call {
  id: string;
  phoneNumber: string;
  direction: CallDirection;
  discussionResume?: string;
  visiteDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewCall {
  phoneNumber: string;
  direction: CallDirection;
  discussionResume?: string;
  visiteDate?: string;
}

export interface UpdateCall {
  phoneNumber?: string;
  direction?: CallDirection;
  discussionResume?: string;
  visiteDate?: string;
}

export interface CallFilter {
  phoneNumber?: string;
  direction?: CallDirection;
  visiteDate?: string;
}

export interface CallQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface CallQueryResult {
  results: Call[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}
