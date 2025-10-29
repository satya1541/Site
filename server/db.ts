import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { websitesTable } from "@shared/schema";

const pool = mysql.createPool({
  host: "15.206.156.197",
  port: 3306,
  user: "satya",
  password: "satya123",
  database: "site_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const db = drizzle(pool, {
  schema: { websites: websitesTable },
  mode: 'default'
});
