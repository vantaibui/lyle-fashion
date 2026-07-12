import { z } from 'zod';

const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_ENABLE_INDEXING: z
    .union([z.boolean(), z.string()])
    .transform((value) => value === true || value === 'true')
    .default(false),
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
});

export const publicEnv = publicEnvironmentSchema.parse({
  NEXT_PUBLIC_ENABLE_INDEXING: process.env.NEXT_PUBLIC_ENABLE_INDEXING,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
