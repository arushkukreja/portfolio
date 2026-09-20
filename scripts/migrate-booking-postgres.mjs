import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

const url = process.env.DATABASE_URL_UNPOOLED;
if (!url || new URL(url).hostname.includes("-pooler")) {
  throw new Error("Set DATABASE_URL_UNPOOLED to the direct database connection for migrations.");
}
try {
  await migrate(drizzle(neon(url)), { migrationsFolder: new URL("../drizzle-postgres", import.meta.url).pathname });
  console.log("Booking database migrations applied.");
} catch {
  console.error("Booking database migration failed. No credentials were printed.");
  process.exitCode = 1;
}
