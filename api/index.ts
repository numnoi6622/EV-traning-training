import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { registerStorageProxy } from "../server/_core/storageProxy";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { getDb, _lastDbError } from "../server/db";
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
      return res.status(500).json({ error: "No DB connection", details: String(_lastDbError?.stack || _lastDbError) });
    }
    
    const queries = [
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        "openId" VARCHAR(64) UNIQUE NOT NULL,
        name TEXT,
        email VARCHAR(320),
        "loginMethod" VARCHAR(64),
        role VARCHAR(20) DEFAULT 'user' NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "lastSignedIn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        "firstName" VARCHAR(100) NOT NULL,
        "lastName" VARCHAR(100) NOT NULL,
        email VARCHAR(320) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        "courseType" VARCHAR(50) NOT NULL,
        "trainingDate" VARCHAR(50) NOT NULL,
        "numberOfParticipants" INTEGER DEFAULT 1 NOT NULL,
        "totalPrice" INTEGER NOT NULL,
        "paymentStatus" VARCHAR(50) DEFAULT 'unpaid' NOT NULL,
        "paymentMethod" VARCHAR(50),
        "paymentSlipUrl" TEXT,
        notes TEXT,
        "billingAddress" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        "registrationId" INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        currency VARCHAR(3) DEFAULT 'THB' NOT NULL,
        "paymentMethod" VARCHAR(50) NOT NULL,
        "transactionId" VARCHAR(100) UNIQUE,
        status VARCHAR(50) DEFAULT 'pending' NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )`
    ];
    
    let results = [];
    for (const q of queries) {
      try {
        await db.execute(sql.raw(q));
        results.push({ status: "success" });
      } catch (e: any) {
        results.push({ status: "error", message: e.message });
      }
    }
    
    res.json({ success: true, results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
