import authService from "@/services/authService";
import type {
  Application,
  ApplicationQueryFilter,
  ApplicationQueryOptions,
  ApplicationQueryResult,
} from "@/types/application";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const API_URL = `${API_BASE_URL}/applications`;

export interface ApplicationPayload {
  fullName: string;
  emailAddress: string;
  jobId: string;
  yearsOfExperience: number;
  linkedinLink?: string;
  coverLetterText?: string;
}

export async function fetchApplications(
  filter: ApplicationQueryFilter = {},
  options: ApplicationQueryOptions = {},
  token?: string
): Promise<ApplicationQueryResult> {
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
  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
}

export async function createApplication(
  payload: ApplicationPayload,
  cvFile: File
): Promise<Application> {
  const formData = new FormData();
  formData.append("fullName", payload.fullName);
  formData.append("emailAddress", payload.emailAddress);
  formData.append("jobId", payload.jobId);
  formData.append("yearsOfExperience", payload.yearsOfExperience.toString());
  if (payload.linkedinLink) {
    formData.append("linkedinLink", payload.linkedinLink);
  }
  if (payload.coverLetterText) {
    formData.append("coverLetterText", payload.coverLetterText);
  }
  formData.append("cv", cvFile);

  const res = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to submit application");
  }

  return res.json();
}

export async function getApplication(
  applicationId: string,
  token?: string
): Promise<Application> {
  const authToken = token || authService.getToken();
  const res = await fetch(`${API_URL}/${applicationId}`, {
    headers: {
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });
  if (!res.ok) throw new Error("Failed to fetch application");
  return res.json();
}

export async function deleteApplication(
  applicationId: string,
  token?: string
): Promise<void> {
  const authToken = token || authService.getToken();
  const res = await fetch(`${API_URL}/${applicationId}`, {
    method: "DELETE",
    headers: {
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });
  if (!res.ok) throw new Error("Failed to delete application");
}

export function getDownloadCvUrl(cvPath: string): string {
  return `${API_BASE_URL}/file/download/${cvPath}`;
}

export async function downloadCv(
  cvPath: string,
  fileName: string,
  token?: string
): Promise<void> {
  const authToken = token || authService.getToken();
  const url = getDownloadCvUrl(cvPath);

  const res = await fetch(url, {
    headers: {
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });

  if (!res.ok) throw new Error("Failed to download CV");

  const blob = await res.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}
