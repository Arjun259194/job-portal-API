import z from "zod";
import { config } from "dotenv";

config();

const envSchema = z.object({
  JWT_SECRET: z.string().min(32),
  DATABASE_URI: z.string(),
  EMAIL_TOKEN: z.string(),
  EMAIL_ADDRESS: z.string().email(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export default function env() {
  envSchema.parse(process.env);
}
