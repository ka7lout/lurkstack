import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://dummy:dummy@ep-dummy-pooler.c-5.eu-central-1.aws.neon.tech/neondb";

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });

/** True when the database is configured at all — used by /api/health. */
export function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

// Provide a dummy pool with end() to satisfy scripts like seed.ts that expect a pg.Pool
export const pool = {
  end: async () => {},
};

export { schema };
