import { z } from "zod";

export const registerBodySchema = z.object({
  email: z
    .string()
    .email()
    .transform((value) => value.toLowerCase()),
  name: z.string().trim().min(1).max(120).optional(),
  password: z.string().min(8).max(128)
});

export const loginBodySchema = z.object({
  email: z
    .string()
    .email()
    .transform((value) => value.toLowerCase()),
  password: z.string().min(1)
});

export const refreshBodySchema = z.object({
  refreshToken: z.string().min(32)
});

export const logoutBodySchema = z.object({
  refreshToken: z.string().min(32).optional()
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
export type RefreshBody = z.infer<typeof refreshBodySchema>;
export type LogoutBody = z.infer<typeof logoutBodySchema>;
