import { json, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const quizzesTable = pgTable('quizzes', {
	id: uuid().defaultRandom().primaryKey(),
	title: varchar({ length: 512 }).notNull(),
	questions: json().notNull(),
});
