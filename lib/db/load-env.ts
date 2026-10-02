// Side-effect module: load .env.local for standalone scripts (seed/migrate).
// Next.js loads env automatically; this is only for `tsx` CLI runs.
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
