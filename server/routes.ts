import type { Express } from "express";
import { createServer, type Server } from "http";
import { insertWebsiteSchema, websitesTable } from "@shared/schema";
import { checkUrl } from "./url-checker";
import { storage } from "./storage";
import { fetchFaviconUrl } from "./favicon-fetcher";

export async function registerRoutes(app: Express): Promise<Server> {
  // Website management endpoints
  app.get("/api/websites", async (req, res) => {
    try {
      const websites = await storage.getWebsites();
      res.json(websites);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch websites" });
    }
  });

  app.get("/api/websites/:id", async (req, res) => {
    try {
      const website = await storage.getWebsite(req.params.id);
      if (!website) {
        return res.status(404).json({ error: "Website not found" });
      }
      res.json(website);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch website" });
    }
  });

  app.post("/api/websites", async (req, res) => {
    try {
      const data = insertWebsiteSchema.parse(req.body);
      // Fetch favicon if not provided
      if (!data.faviconUrl) {
        data.faviconUrl = await fetchFaviconUrl(data.url);
      }
      const website = await storage.createWebsite(data);
      res.status(201).json(website);
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        res.status(400).json({ error: "Invalid request", details: error });
      } else {
        res.status(500).json({ error: "Failed to create website" });
      }
    }
  });

  app.put("/api/websites/:id", async (req, res) => {
    try {
      const data = insertWebsiteSchema.partial().parse(req.body);
      // Fetch favicon if URL changed and favicon not provided
      if (data.url && !data.faviconUrl) {
        data.faviconUrl = await fetchFaviconUrl(data.url);
      }
      const website = await storage.updateWebsite(req.params.id, data);
      if (!website) {
        return res.status(404).json({ error: "Website not found" });
      }
      res.json(website);
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        res.status(400).json({ error: "Invalid request", details: error });
      } else {
        res.status(500).json({ error: "Failed to update website" });
      }
    }
  });

  app.delete("/api/websites/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteWebsite(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Website not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete website" });
    }
  });

  // Check website status
  app.post("/api/check/:id", async (req, res) => {
    try {
      const website = await storage.getWebsite(req.params.id);
      if (!website) {
        return res.status(404).json({ error: "Website not found" });
      }
      
      const result = await checkUrl(website.url);
      res.json({
        ...result,
        websiteId: website.id,
        checkedAt: new Date()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to check website" });
    }
  });

  // Batch check all websites
  app.post("/api/check-all", async (req, res) => {
    try {
      const websites = await storage.getWebsites();
      const results = await Promise.all(
        websites.map(async (website) => {
          const result = await checkUrl(website.url);
          return {
            ...result,
            websiteId: website.id,
            checkedAt: new Date()
          };
        })
      );
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to check websites" });
    }
  });

  // Update favicons for all websites
  app.post("/api/update-favicons", async (req, res) => {
    try {
      const websites = await storage.getWebsites();
      const updates = await Promise.all(
        websites.map(async (website) => {
          try {
            const faviconUrl = await fetchFaviconUrl(website.url);
            if (faviconUrl) {
              await storage.updateWebsite(website.id, { faviconUrl });
              return { id: website.id, name: website.name, faviconUrl, updated: true };
            }
            return { id: website.id, name: website.name, faviconUrl: null, updated: false };
          } catch (error) {
            return { id: website.id, name: website.name, error: String(error), updated: false };
          }
        })
      );
      res.json({ message: "Favicons updated", count: websites.length, updates });
    } catch (error) {
      res.status(500).json({ error: "Failed to update favicons", details: String(error) });
    }
  });


  const httpServer = createServer(app);

  return httpServer;
}
