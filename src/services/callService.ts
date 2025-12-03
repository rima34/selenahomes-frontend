import authService from "@/services/authService";
import type {
  Call,
  NewCall,
  UpdateCall,
  CallFilter,
  CallQueryOptions,
  CallQueryResult,
} from "@/types/call";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const API_URL = `${API_BASE_URL}/calls`;

export async function fetchCalls(
  filter: CallFilter = {},
  options: CallQueryOptions = {},
  token?: string
): Promise<CallQueryResult> {
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
  if (!res.ok) throw new Error("Failed to fetch calls");
  return res.json();
}

export async function fetchCall(callId: string, token?: string): Promise<Call> {
  const authToken = token || authService.getToken();
  const res = await fetch(`${API_URL}/${callId}`, {
    headers: {
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });
  if (!res.ok) throw new Error("Failed to fetch call");
  return res.json();
}

export async function createCall(
  payload: NewCall,
  token?: string
): Promise<Call> {
  const authToken = token || authService.getToken();
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create call");
  return res.json();
}

export async function updateCall(
  callId: string,
  payload: UpdateCall,
  token?: string
): Promise<Call> {
  const authToken = token || authService.getToken();
  const res = await fetch(`${API_URL}/${callId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update call");
  return res.json();
}

export async function deleteCall(callId: string, token?: string) {
  const authToken = token || authService.getToken();
  const res = await fetch(`${API_URL}/${callId}`, {
    method: "DELETE",
    headers: {
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });
  if (!res.ok) throw new Error("Failed to delete call");
  return res.json();
}
