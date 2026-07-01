import { describe, expect, it } from "vitest";
import { ENV } from "./_core/env";

describe("Admin Credentials", () => {
  it("should have admin username and password configured", () => {
    expect(ENV.adminUsername).toBeDefined();
    expect(ENV.adminPassword).toBeDefined();
    expect(ENV.adminUsername).toBe("admin");
    expect(ENV.adminPassword).toBe("admin");
  });

  it("should validate admin credentials", () => {
    const username = ENV.adminUsername;
    const password = ENV.adminPassword;
    
    const isValid = username === "admin" && password === "admin";
    expect(isValid).toBe(true);
  });
});
