import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),

    // Clerk
    CLERK_WEBHOOK_SECRET: z.string().min(1),
  },

  experimental__runtimeEnv: process.env,
});
