export interface Application {
  id: string;
  fullName: string;
  emailAddress: string;
  jobId: {
    id: string;
    name: string;
    type: string;
    location: string;
  };
  yearsOfExperience: number;
  linkedinLink?: string;
  coverLetterText?: string;
  uploadedCvPath: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationQueryFilter {
  fullName?: string;
  emailAddress?: string;
  jobId?: string;
  yearsOfExperienceMin?: number;
  yearsOfExperienceMax?: number;
  hasLinkedin?: boolean;
  hasCoverLetter?: boolean;
}

export interface ApplicationQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface ApplicationQueryResult {
  results: Application[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}
