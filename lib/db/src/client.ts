import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const db = postgres(process.env.DATABASE_URL || "");
export const client = drizzle(db, { schema });
