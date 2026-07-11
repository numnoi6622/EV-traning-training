import { eq } from "drizzle-orm";
import { InsertUser, users, registrations } from "../drizzle/schema";
import { ENV } from './_core/env';

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

let _db: any = null;
export let _lastDbError: any = null;

export async function getDb() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  
  if (!_db && connectionString) {
    try {
      const sql = neon(connectionString);
      _db = drizzle(sql);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _lastDbError = error;
      _db = null;
    }
  } else if (!_db) {
    _lastDbError = "DATABASE_URL is empty. Please check Vercel Environment Variables.";
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// Registration queries
export async function createRegistration(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  courseType: "repair" | "charging" | "users";
  trainingDate: string;
  numberOfParticipants: number;
  totalPrice: number;
  notes?: string;
  billingAddress?: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }


  return await db.insert(registrations).values({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    courseType: data.courseType,
    trainingDate: data.trainingDate,
    numberOfParticipants: data.numberOfParticipants,
    totalPrice: data.totalPrice,
    paymentStatus: "unpaid",
    paymentMethod: "bank_transfer",
    notes: data.notes || null,
    billingAddress: data.billingAddress || null,
  });
}

export async function getRegistrations() {
  const db = await getDb();
  if (!db) {
    return [];
  }


  return await db.select().from(registrations);
}

export async function getRegistrationById(id: number) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }


  const result = await db.select().from(registrations).where(eq(registrations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getRegistrationByPhone(phone: string) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }


  const result = await db.select().from(registrations).where(eq(registrations.phone, phone)).orderBy(registrations.createdAt).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function uploadRegistrationSlip(id: number, slipUrl: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }


  return await db.update(registrations).set({ 
    paymentSlipUrl: slipUrl,
    paymentStatus: "pending" 
  }).where(eq(registrations.id, id));
}

export async function updateRegistrationPaymentStatus(id: number, status: "unpaid" | "pending" | "completed" | "failed") {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }


  return await db.update(registrations).set({ paymentStatus: status }).where(eq(registrations.id, id));
}
