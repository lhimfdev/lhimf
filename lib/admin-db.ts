import { Pool } from "pg";

const globalForAdminPg = globalThis as typeof globalThis & { lhimfAdminPool?: Pool };

export function getAdminPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured.");
  if (!globalForAdminPg.lhimfAdminPool) {
    globalForAdminPg.lhimfAdminPool = new Pool({
      connectionString,
      max: 5,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
      idleTimeoutMillis: 30000,
    });
  }
  return globalForAdminPg.lhimfAdminPool;
}
