import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { DashboardRole, DashboardSession } from "@/types/dashboard";
import { isSupabaseConfigured } from "@/lib/server/env";
import { supabaseAuthGetUser, supabaseAuthRefresh, supabaseRest } from "@/lib/server/supabase";

const ACCESS_COOKIE = "ks_dashboard_access_token";
const REFRESH_COOKIE = "ks_dashboard_refresh_token";

type RoleRow = {
  user_id: string;
  role: DashboardRole;
  display_name: string | null;
  status: string;
};

async function readAccessToken() {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
}

async function readRefreshToken() {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value ?? null;
}

export async function setDashboardAuthCookies(accessToken: string, refreshToken: string) {
  const store = await cookies();
  const base = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  store.set(ACCESS_COOKIE, accessToken, { ...base, maxAge: 60 * 60 * 24 * 7 });
  store.set(REFRESH_COOKIE, refreshToken, { ...base, maxAge: 60 * 60 * 24 * 30 });
}

export async function clearDashboardAuthCookies() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

async function hydrateSessionFromAccessToken(accessToken: string): Promise<DashboardSession | null> {
  const user = await supabaseAuthGetUser(accessToken);
  const [roleRow] = await supabaseRest<RoleRow[]>(
    `dashboard_user_roles?select=user_id,role,display_name,status&user_id=eq.${user.id}&status=eq.active&limit=1`,
  );

  if (!roleRow) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    role: roleRow.role,
    displayName:
      roleRow.display_name ||
      (typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "") ||
      user.email ||
      "Dashboard User",
  };
}

export async function getDashboardSession(): Promise<DashboardSession | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const accessToken = await readAccessToken();
  const refreshToken = await readRefreshToken();

  if (accessToken) {
    try {
      return await hydrateSessionFromAccessToken(accessToken);
    } catch {
      // Try refresh-token recovery below.
    }
  }

  if (!refreshToken) {
    return null;
  }

  try {
    const refreshed = await supabaseAuthRefresh(refreshToken);
    await setDashboardAuthCookies(refreshed.access_token, refreshed.refresh_token);
    return await hydrateSessionFromAccessToken(refreshed.access_token);
  } catch {
    try {
      await clearDashboardAuthCookies();
    } catch {
      // Ignore cleanup errors during session restore.
    }
    return null;
  }
}

export function redirectForRole(role: DashboardRole) {
  if (role === "admin") {
    redirect("/admin");
  }

  if (role === "affiliate") {
    redirect("/affiliate");
  }

  redirect("/login");
}

export async function requireDashboardRole(role: DashboardRole) {
  const session = await getDashboardSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== role) {
    redirectForRole(session.role);
  }

  return session;
}

export async function requireAnyDashboardSession() {
  const session = await getDashboardSession();
  if (!session) {
    redirect("/login");
  }

  return session;
}
