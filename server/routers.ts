import { COOKIE_NAME } from "../shared/const";
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
      .mutation(async ({ ctx }) => {
        return { success: true };
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
        billingAddress: z.string().optional(),
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
            billingAddress: input.billingAddress,
          });
          return { success: true, message: "ลงทะเบียนสำเร็จ" };
        } catch (error) {
          console.error("Registration error:", error);
          throw new Error("ไม่สามารถลงทะเบียนได้");
        }
      }),

    uploadSlip: publicProcedure
      .input(z.object({
        id: z.number(),
        paymentSlipUrl: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { uploadRegistrationSlip } = await import("./db");
        try {
          await uploadRegistrationSlip(input.id, input.paymentSlipUrl);
          return { success: true };
        } catch (error) {
          throw new Error("อัพโหลดสลิปไม่สำเร็จ");
        }
      }),

    checkStatus: publicProcedure
      .input(z.object({ phone: z.string() }))
      .query(async ({ input }) => {
        const { getRegistrationByPhone } = await import("./db");
        const registration = await getRegistrationByPhone(input.phone);
        if (!registration) {
          throw new TRPCError({ code: "NOT_FOUND", message: "ไม่พบข้อมูลการลงทะเบียนสำหรับเบอร์โทรนี้" });
        }
        return registration;
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
