import { redirect } from "next/navigation";

import { getDashboardSession, redirectForRole } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getDashboardSession();

  if (!session) {
    redirect("/login");
  }

  redirectForRole(session.role);
}
