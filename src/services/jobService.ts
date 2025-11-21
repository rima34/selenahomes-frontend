import authService from "@/services/authService";

export interface JobPayload {
  name: string;
  description?: string;
  type: "full time" | "part time";
  location: string;
  creationDate?: string;
}

export interface Job extends JobPayload {
  id: string;
  creationDate: string;
}

export interface JobQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface JobQueryFilter {
  name?: string;
  type?: "full time" | "part time";
  location?: string;
  creationDateFrom?: string;
  creationDateTo?: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const API_URL = `${API_BASE_URL}/jobs`;

export async function fetchJobs(
  filter: JobQueryFilter = {},
  options: JobQueryOptions = {},
  token?: string
) {
  const params = new URLSearchParams({
    filter: JSON.stringify(filter),
    options: JSON.stringify(options),
  });
  const authToken = token || authService.getToken();
  const res = await fetch(`${API_URL}?${params.toString()}`, {
    headers: {
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

export async function createJob(payload: JobPayload, token?: string) {
  const authToken = token || authService.getToken();
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create job");
  return res.json();
}

export async function updateJob(
  jobId: string,
  payload: Partial<JobPayload>,
  token?: string
) {
  const authToken = token || authService.getToken();
  const res = await fetch(`${API_URL}/${jobId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update job");
  return res.json();
}

export async function deleteJob(jobId: string, token?: string) {
  const authToken = token || authService.getToken();
  const res = await fetch(`${API_URL}/${jobId}`, {
    method: "DELETE",
    headers: {
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });
  if (!res.ok) throw new Error("Failed to delete job");
  return res.json();
}
