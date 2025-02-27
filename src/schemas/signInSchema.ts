import { z } from "zod";

export const SignInSchema = z.object({
  identifier: z.string(), // identifier means email or username
  password: z.string(),
});
