import 'server-only';

import { z } from 'zod';

const serverEnvironmentSchema = z.object({
  COMMERCE_API_URL: z.url().optional(),
  COMMERCE_API_TOKEN: z.string().min(1).optional(),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
});

export const serverEnv = serverEnvironmentSchema.parse({
  COMMERCE_API_URL: process.env.COMMERCE_API_URL,
  COMMERCE_API_TOKEN: process.env.COMMERCE_API_TOKEN,
  NODE_ENV: process.env.NODE_ENV,
});
