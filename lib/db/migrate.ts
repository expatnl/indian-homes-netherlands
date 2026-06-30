import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Client } from "pg";

const MIGRATIONS_DIR = path.resolve(__dirname, "../../supabase/migrations");

export function listMigrationFiles(): string[] {
  return readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();
}

export async function runMigrations(client: Client): Promise<string[]> {
  const files = listMigrationFiles();
  for (const file of files) {
    const sql = readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
    try {
      await client.query(sql);
    } catch (err) {
      throw new Error(`Migration failed: ${file}\n${(err as Error).message}`);
    }
  }
  return files;
}
