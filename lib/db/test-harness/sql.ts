import type { PoolClient, QueryResult } from "pg";

/** Builds and runs `insert into <table> (...) values (...)` from a plain object. */
export async function insertRow(
  client: PoolClient,
  table: string,
  row: Record<string, unknown>
): Promise<QueryResult> {
  const columns = Object.keys(row);
  const values = Object.values(row);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
  const text = `insert into ${table} (${columns.join(", ")}) values (${placeholders}) returning *`;
  return client.query(text, values);
}

/** Postgres error code for a NOT NULL violation. */
export const NOT_NULL_VIOLATION = "23502";
/** Postgres error code for an invalid input value for an enum type. */
export const INVALID_TEXT_REPRESENTATION = "22P02";
