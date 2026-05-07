import { migrate } from "drizzle-orm/postgres-js/migrator";
import { client } from "./client.js";

migrate(client, { migrationsFolder: "./drizzle" })
  .then(() => { console.log("✓ Migrations complete"); process.exit(0); })
  .catch(e => { console.error(e); process.exit(1); });
