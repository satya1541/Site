import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    host: "15.206.156.197",
    port: 3306,
    user: "satya",
    password: "satya123",
    database: "site_db",
  },
});
