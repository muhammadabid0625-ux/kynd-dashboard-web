import { NextResponse } from "next/server";

import { setDashboardAuthCookies } from "@/lib/server/auth";
import { supabaseAuthToken, supabaseRest } from "@/lib/server/supabase";
import type { DashboardRole } from "@/types/dashboard";

type RoleRow = {
  role: DashboardRole;
  status: string;
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return NextResponse.redirect(new URL("/login?error=Enter%20email%20and%20password", request.url));
  }

  try {
    const session = await supabaseAuthToken(email, password);
    const [role] = await supabaseRest<RoleRow[]>(
      `dashboard_user_roles?select=role,status&user_id=eq.${session.user.id}&status=eq.active&limit=1`,
    );

    if (!role) {
      return NextResponse.redirect(new URL("/login?error=No%20dashboard%20role%20assigned", request.url));
    }

    await setDashboardAuthCookies(session.access_token, session.refresh_token);

    return NextResponse.redirect(new URL(role.role === "admin" ? "/admin" : "/affiliate", request.url));
  } catch {
    return NextResponse.redirect(new URL("/login?error=Sign%20in%20failed", request.url));
  }
}
