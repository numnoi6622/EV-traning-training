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
    const match = opts.req.headers.cookie.match(/admin-session=([^;]+)/);
    if (match) {
      try {
        const decoded = JSON.parse(atob(match[1]));
        if (decoded.role === "admin") {
          user = {
            id: -1,
            openId: "admin",
            name: decoded.username || "Admin",
            email: null,
            loginMethod: "local",
            role: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
            lastSignedIn: new Date()
          } as any;
        }
      } catch (e) {
        // Ignore parse error
      }
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
