import { Pool } from "pg";

let pool: Pool | null = null;

export function getTestPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.TEST_PG_HOST,
      port: Number(process.env.TEST_PG_PORT),
      user: process.env.TEST_PG_USER,
      database: process.env.TEST_PG_DATABASE,
      max: 10,
    });
  }
  return pool;
}
