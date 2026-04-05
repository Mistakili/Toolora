import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Strip `sslmode` from the connection string so pg-connection-string does not
// emit a deprecation warning about it. SSL is handled explicitly via the `ssl`
// option below, which is the recommended approach going forward.
const connectionString = process.env.DATABASE_URL.replace(
  /([?&])sslmode=[^&]*/,
  (_, sep) => (sep === "?" ? "?" : ""),
).replace(/\?$/, "");

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});
export const db = drizzle(pool, { schema });

export * from "./schema";
