import { type Website, type InsertWebsite, websitesTable } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Website management
  getWebsites(): Promise<Website[]>;
  getWebsite(id: string): Promise<Website | undefined>;
  createWebsite(website: InsertWebsite): Promise<Website>;
  updateWebsite(id: string, website: Partial<InsertWebsite>): Promise<Website | undefined>;
  deleteWebsite(id: string): Promise<boolean>;
}

export class DbStorage implements IStorage {
  async getWebsites(): Promise<Website[]> {
    const websites = await db.select().from(websitesTable).orderBy(desc(websitesTable.createdAt));
    return websites.map(w => ({ ...w, faviconUrl: w.faviconUrl ?? undefined }));
  }

  async getWebsite(id: string): Promise<Website | undefined> {
    const result = await db.select().from(websitesTable).where(eq(websitesTable.id, id)).limit(1);
    return result[0] ? { ...result[0], faviconUrl: result[0].faviconUrl ?? undefined } : undefined;
  }

  async createWebsite(insertWebsite: InsertWebsite): Promise<Website> {
    const id = randomUUID();
    await db.insert(websitesTable).values({
      id,
      ...insertWebsite
    });
    const website = await this.getWebsite(id);
    return website!;
  }

  async updateWebsite(id: string, updates: Partial<InsertWebsite>): Promise<Website | undefined> {
    await db.update(websitesTable)
      .set(updates)
      .where(eq(websitesTable.id, id));
    return await this.getWebsite(id);
  }

  async deleteWebsite(id: string): Promise<boolean> {
    const existing = await this.getWebsite(id);
    if (!existing) return false;
    await db.delete(websitesTable).where(eq(websitesTable.id, id));
    return true;
  }
}

export const storage = new DbStorage();
