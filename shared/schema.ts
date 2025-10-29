import { z } from "zod";
import { mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";

// Website monitoring schema
export const websiteSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
  faviconUrl: z.string().optional(),
  createdAt: z.date()
});

export const insertWebsiteSchema = websiteSchema.omit({ id: true, createdAt: true });

export type Website = z.infer<typeof websiteSchema>;
export type InsertWebsite = z.infer<typeof insertWebsiteSchema>;

// Check options and results
export const checkOptionsSchema = z.object({
  timeout: z.number().min(1000).max(30000).default(5000),
  followRedirects: z.boolean().default(true),
  validateSSL: z.boolean().default(true),
  customHeaders: z.string().optional()
});

export const checkResultSchema = z.object({
  websiteId: z.string().optional(),
  url: z.string(),
  isReachable: z.boolean(),
  responseTime: z.number(),
  ipAddress: z.string(),
  statusCode: z.number(),
  sslValid: z.boolean(),
  dnsTime: z.number().optional(),
  tcpTime: z.number().optional(),
  tlsTime: z.number().optional(),
  error: z.string().optional(),
  checkedAt: z.date().optional()
});

export type CheckOptions = z.infer<typeof checkOptionsSchema>;
export type CheckResult = z.infer<typeof checkResultSchema>;

// Database tables
export const websitesTable = mysqlTable("websites", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  url: varchar("url", { length: 2048 }).notNull(),
  faviconUrl: varchar("favicon_url", { length: 2048 }),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
