import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || "postgres://user:pass@localhost:5432/db";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
