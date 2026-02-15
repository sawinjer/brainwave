import z from 'zod';
import 'dotenv/config';

export const env = z
	.object({
		DATABASE_URL: z.string(),
	})
	.parse(process.env);
