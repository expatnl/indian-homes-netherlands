import { readFileSync } from "node:fs";
import path from "node:path";
import { Client } from "pg";
import { startEphemeralPostgres } from "./lib/db/test-harness/ephemeralPostgres";
import { runMigrations } from "./lib/db/migrate";

export default async function setup() {
  const pg = await startEphemeralPostgres();

  const client = new Client({
    host: pg.host,
    port: pg.port,
    user: pg.user,
    database: pg.database,
  });
  await client.connect();

  const stubsSql = readFileSync(
    path.resolve(__dirname, "lib/db/test-harness/supabase-stubs.sql"),
    "utf8"
  );
  await client.query(stubsSql);
  await runMigrations(client);
  await client.end();

  // Vitest's globalSetup runs once in the main process before worker
  // threads spawn; mutating process.env here is how connection info is
  // handed to the actual test files (see lib/db/test-harness/pool.ts).
  process.env.TEST_PG_HOST = pg.host;
  process.env.TEST_PG_PORT = String(pg.port);
  process.env.TEST_PG_USER = pg.user;
  process.env.TEST_PG_DATABASE = pg.database;

  return async () => {
    await pg.stop();
  };
}
