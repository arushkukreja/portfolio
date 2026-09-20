import { neon } from "@neondatabase/serverless";
import type { BookingEnv } from "./booking-api";

/** The booking API uses a small prepared-statement interface on both hosts. */
export function createPostgresBookingDatabase(url: string): NonNullable<BookingEnv["DB"]> {
  const sql = neon(url);
  return {
    prepare(statement) {
      // Only application-owned SQL reaches this adapter; visitor values remain
      // bound parameters. PostgreSQL uses $1, $2, ... instead of SQLite's ?.
      let position = 0;
      const query = statement.replace(/\?/g, () => `$${++position}`);
      const prepared = (values: (string | number | null)[] = []): ReturnType<NonNullable<BookingEnv["DB"]>["prepare"]> => ({
        bind: (...args) => prepared(args),
        async first<T>() {
          const rows = await sql.query(query, values, { fetchOptions: { signal: AbortSignal.timeout(15000) } });
          return (rows[0] as T | undefined) ?? null;
        },
        async all<T>() {
          const rows = await sql.query(query, values, { fetchOptions: { signal: AbortSignal.timeout(15000) } });
          return { results: rows as T[] };
        },
        async run() {
          const result = await sql.query(query, values, { fullResults: true, fetchOptions: { signal: AbortSignal.timeout(15000) } });
          return { meta: { changes: result.rowCount ?? 0 } };
        },
      });
      return prepared();
    },
  };
}
