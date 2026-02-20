import z from "zod";
import "dotenv/config";

console.log("[ENV]", process.env);

export const env = z
  .object({
    DATABASE_URL: z.string(),
    REDIS_URL: z.string(),
    KAFKA_BROKERS: z.string(),
  })
  .parse(process.env);
