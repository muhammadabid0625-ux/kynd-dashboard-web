import { assertSupabaseConfigured, getEnv } from "@/lib/server/env";

type RequestMode = "anon" | "service" | "user";

function getHeaders(mode: RequestMode, accessToken?: string) {
  const env = getEnv();
  const apiKey = mode === "service" ? env.supabaseServiceRoleKey : env.supabaseAnonKey;

  return {
    apikey: apiKey,
    Authorization: `Bearer ${mode === "user" ? accessToken : apiKey}`,
    "Content-Type": "application/json",
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Supabase request failed with status ${response.status}`);
  }

  const text = await response.text();
  return (text ? (JSON.parse(text) as T) : ([] as unknown as T));
}

export async function supabaseRest<T>(
  path: string,
  init?: RequestInit,
  mode: RequestMode = "service",
  accessToken?: string,
) {
  assertSupabaseConfigured();
  const env = getEnv();
  const response = await fetch(`${env.supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...getHeaders(mode, accessToken),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  return parseResponse<T>(response);
}

export async function supabaseAuthToken(email: string, password: string) {
  assertSupabaseConfigured();
  const env = getEnv();
  const response = await fetch(`${env.supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: getHeaders("anon"),
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  return parseResponse<{
    access_token: string;
    refresh_token: string;
    user: { id: string; email: string | null; user_metadata?: Record<string, unknown> };
  }>(response);
}

export async function supabaseAuthGetUser(accessToken: string) {
  assertSupabaseConfigured();
  const env = getEnv();
  const response = await fetch(`${env.supabaseUrl}/auth/v1/user`, {
    headers: getHeaders("user", accessToken),
    cache: "no-store",
  });

  return parseResponse<{
    id: string;
    email: string | null;
    user_metadata?: Record<string, unknown>;
  }>(response);
}

export async function supabaseAuthRefresh(refreshToken: string) {
  assertSupabaseConfigured();
  const env = getEnv();
  const response = await fetch(`${env.supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: getHeaders("anon"),
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });

  return parseResponse<{
    access_token: string;
    refresh_token: string;
    user: { id: string; email: string | null; user_metadata?: Record<string, unknown> };
  }>(response);
}
