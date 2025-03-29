import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    // Imagekit
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: z.string().min(1),
    NEXT_PUBLIC__IMAGEKIT_URL_ENDPOINT: z.string().url().min(1),
  },

  experimental__runtimeEnv: {
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    NEXT_PUBLIC__IMAGEKIT_URL_ENDPOINT:
      process.env.NEXT_PUBLIC__IMAGEKIT_URL_ENDPOINT,
  },
});
