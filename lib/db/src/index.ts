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
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Prevent unhandled 'error' events on idle pool clients from crashing the
// process. This happens when the database server terminates a connection
// mid-session (e.g. maintenance, idle timeout). The pool will automatically
// create a new connection on the next request.
pool.on("error", (err) => {
  console.error("[db] Unexpected pool client error (connection will be replaced):", err.message);
});

export const db = drizzle(pool, { schema });

export * from "./schema";
