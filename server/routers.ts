import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

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
    list: publicProcedure.query(async () => {
      const { getRegistrations } = await import("./db");
      return await getRegistrations();
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const { getRegistrationById } = await import("./db");
        return await getRegistrationById(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
