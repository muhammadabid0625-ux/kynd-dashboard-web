import { NextResponse } from "next/server";

import { clearDashboardAuthCookies } from "@/lib/server/auth";

export async function POST(request: Request) {
  await clearDashboardAuthCookies();
  return NextResponse.redirect(new URL("/login", request.url));
}
