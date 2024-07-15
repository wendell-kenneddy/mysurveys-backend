import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  ORIGIN: z.string(),
  PORT: z.coerce.number(),
});

const env = envSchema.parse(process.env);

export { env };
