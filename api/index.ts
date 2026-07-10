import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { registerStorageProxy } from "../server/_core/storageProxy";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { getDb } from "../server/db";
import { sql } from "drizzle-orm";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

registerStorageProxy(app);
registerOAuthRoutes(app);

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.get("/api/migrate-db", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "No DB connection" });
    }
    
    // Execute migrations directly
    const queries = [
      "ALTER TABLE `registrations` MODIFY COLUMN `paymentStatus` enum('unpaid','pending','completed','failed') NOT NULL DEFAULT 'unpaid'",
      "ALTER TABLE `registrations` ADD COLUMN `paymentSlipUrl` mediumtext",
      "ALTER TABLE `registrations` ADD COLUMN `billingAddress` text"
    ];
    
    let results = [];
    for (const q of queries) {
      try {
        await db.execute(sql.raw(q));
        results.push({ query: q, status: "success" });
      } catch (e: any) {
        results.push({ query: q, status: "error", message: e.message });
      }
    }
    
    res.json({ success: true, results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
