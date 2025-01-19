import z from "zod";
import { config } from "dotenv";

config();

const envSchema = z.object({
  JWT_SECRET: z.string().min(32),
  DATABASE_URI: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export default function env() {
  envSchema.parse(process.env);
}
