import { z } from "zod";

export const VerifySchema = z.object({
  code: z.string().min(6, "verify code must be at least 6 digits"),
});
