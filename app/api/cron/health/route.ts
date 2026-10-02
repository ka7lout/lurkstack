import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { record } from "@/lib/monitor";

export const dynamic = "force-dynamic";

/**
 * Protected scheduled health check. Lightweight — a single connectivity probe.
 * Intended for low-frequency observability, not to defeat scale-to-zero.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const provided =
    request.headers.get("authorization")?.replace("Bearer ", "") ??
    new URL(request.url).searchParams.get("secret");

  if (secret && provided !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    await db.execute(sql`select 1`);
    return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch (err) {
    void record({
      action: "health_check",
      result: "failure",
      severity: "critical",
      reasonCode: "db_unreachable",
      summary: (err as Error).message,
    });
    return NextResponse.json({ status: "error" }, { status: 503 });
  }
}
