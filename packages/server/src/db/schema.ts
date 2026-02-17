import type { InferSelectModel } from 'drizzle-orm';
import { integer, json, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const quizzesTable = pgTable('quizzes', {
	id: uuid().defaultRandom().primaryKey(),
	title: varchar({ length: 512 }).notNull(),
	questions: json().notNull(),
});

export const gamesTable = pgTable('games', {
	id: uuid().defaultRandom().primaryKey(),
	quiz: json().notNull(),
	answers: json().notNull(),
	currentQuestionIndex: integer('current_question_index').notNull().default(0),
	playersAmount: integer('players_amount').notNull().default(0),
});

export type Quiz = InferSelectModel<typeof quizzesTable>;

export type Game = InferSelectModel<typeof gamesTable> & {
	answers: Array<Record<string, number>>;
	quiz: Pick<Quiz, 'title' | 'questions'>;
};
