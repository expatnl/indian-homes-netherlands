import { spawn } from "node:child_process";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import net from "node:net";
import { existsSync, readdirSync } from "node:fs";

export interface EphemeralPostgres {
  port: number;
  host: string;
  user: string;
  database: string;
  dataDir: string;
  stop: () => Promise<void>;
}

function resolvePgBinDir(): string {
  if (process.env.PG_BIN_DIR) return process.env.PG_BIN_DIR;

  const pgRoot = "C:/Program Files/PostgreSQL";
  const versions = existsSync(pgRoot)
    ? readdirSync(pgRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort()
        .reverse()
    : [];

  for (const version of versions) {
    const binDir = path.join(pgRoot, version, "bin");
    if (existsSync(path.join(binDir, "initdb.exe"))) return binDir;
  }

  throw new Error(
    "Could not find a local PostgreSQL install. Set PG_BIN_DIR to the " +
      "directory containing initdb/pg_ctl/psql (e.g. " +
      "'C:/Program Files/PostgreSQL/17/bin')."
  );
}

/**
 * Runs a command to completion using stdio: "ignore". This matters
 * specifically for `pg_ctl start`, which spawns a detached `postgres.exe`
 * that inherits any piped stdout/stderr handles — with execFile/exec
 * (pipe-based stdio), Node waits for those pipes to close, which never
 * happens because the long-running postgres process keeps holding them
 * open. Ignoring stdio entirely avoids that hang for every call here.
 */
function run(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "ignore" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address && typeof address === "object") {
        const port = address.port;
        server.close(() => resolve(port));
      } else {
        reject(new Error("Could not determine a free port"));
      }
    });
  });
}

export async function startEphemeralPostgres(): Promise<EphemeralPostgres> {
  const binDir = resolvePgBinDir();
  const dataDir = await mkdtemp(path.join(tmpdir(), "indianhomes-pgtest-"));
  const port = await getFreePort();
  const user = "postgres";
  const database = "indianhomes_test";
  const host = "127.0.0.1";
  const logFile = path.join(dataDir, "server.log");

  try {
    await run(path.join(binDir, "initdb"), [
      "-D",
      dataDir,
      "-U",
      user,
      "--auth=trust",
      "--encoding=UTF8",
    ]);

    await run(path.join(binDir, "pg_ctl"), [
      "-D",
      dataDir,
      "-l",
      logFile,
      "-o",
      `-p ${port} -c listen_addresses=${host}`,
      "start",
    ]);

    await run(path.join(binDir, "createdb"), [
      "-h",
      host,
      "-p",
      String(port),
      "-U",
      user,
      database,
    ]);
  } catch (err) {
    const log = await readFile(logFile, "utf8").catch(() => "(no server log)");
    throw new Error(`Failed to start ephemeral Postgres: ${(err as Error).message}\n${log}`);
  }

  const stop = async () => {
    try {
      await run(path.join(binDir, "pg_ctl"), ["-D", dataDir, "stop", "-m", "fast"]);
    } finally {
      await rm(dataDir, { recursive: true, force: true });
    }
  };

  return { port, host, user, database, dataDir, stop };
}
