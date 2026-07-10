import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }

  // Fallback to check for local admin-session cookie
  if (!user && opts.req.headers.cookie) {
    if (opts.req.headers.cookie.includes("admin-session")) {
      user = {
        id: -1,
        openId: "admin",
        name: "Admin",
        email: "admin@ev.com",
        loginMethod: "local",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date()
      };
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
