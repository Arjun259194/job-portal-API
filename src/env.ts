import z from "zod";
import { config } from "dotenv";

config();

const envSchema = z.object({
  JWT_SECRET: z.string().min(32).nonempty(),
  DATABASE_URI: z.string().nonempty(),
  EMAIL_TOKEN: z.string().nonempty(),
  EMAIL_ADDRESS: z.string().email().nonempty(),
  PASSWORD_SALT_ROUNDS: z.string().min(1).nonempty(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> { }
  }
}

export default function env() {
  envSchema.parse(process.env);
}
