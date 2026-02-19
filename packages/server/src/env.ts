import z from 'zod';
import 'dotenv/config';

export const env = z
	.object({
		DATABASE_URL: z.string(),
		REDIS_URL: z.string(),
		KAFKA_BROKERS: z.string().default('localhost:9092'),
	})
	.parse(process.env);
