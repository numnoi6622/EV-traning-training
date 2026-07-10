import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "ไม่มีสิทธิ์เข้าถึง" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    adminLogin: publicProcedure
      .input(z.object({
        username: z.string(),
        password: z.string(),
      }))
      .mutation(({ input, ctx }) => {
        const adminUsername = process.env.ADMIN_USERNAME || "adminev";
        const adminPassword = process.env.ADMIN_PASSWORD || "evadmin";
        
        if (input.username !== adminUsername || input.password !== adminPassword) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }
        
        // Set admin session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        const adminToken = Buffer.from(JSON.stringify({ role: "admin", username: adminUsername })).toString("base64");
        ctx.res.setHeader("Set-Cookie", `admin-session=${adminToken}; ${Object.entries(cookieOptions).map(([k, v]) => `${k}=${v}`).join("; ")}`);
        
        return { success: true, message: "เข้าสู่ระบบสำเร็จ" };
      }),
  }),

  registration: router({
    create: publicProcedure
      .input(z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        courseType: z.enum(["repair", "charging", "users"]),
        trainingDate: z.string(),
        numberOfParticipants: z.number().min(1),
        totalPrice: z.number().min(0),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { createRegistration } = await import("./db");
        try {
          const result = await createRegistration({
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phone,
            courseType: input.courseType,
            trainingDate: input.trainingDate,
            numberOfParticipants: input.numberOfParticipants,
            totalPrice: input.totalPrice,
            notes: input.notes,
          });
          return { success: true, message: "ลงทะเบียนสำเร็จ" };
        } catch (error) {
          console.error("Registration error:", error);
          throw new Error("ไม่สามารถลงทะเบียนได้");
        }
      }),
    list: adminProcedure.query(async () => {
      const { getRegistrations } = await import("./db");
      return await getRegistrations();
    }),
    getById: adminProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const { getRegistrationById } = await import("./db");
        return await getRegistrationById(input);
      }),
    updatePaymentStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "completed", "failed"]),
      }))
      .mutation(async ({ input }) => {
        const { updateRegistrationPaymentStatus } = await import("./db");
        try {
          await updateRegistrationPaymentStatus(input.id, input.status);
          return { success: true, message: "อัปเดตสถานะสำเร็จ" };
        } catch (error) {
          console.error("Update payment status error:", error);
          throw new Error("ไม่สามารถอัปเดตสถานะได้");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
