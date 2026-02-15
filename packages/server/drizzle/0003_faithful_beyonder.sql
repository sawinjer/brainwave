DROP TABLE "answers" CASCADE;--> statement-breakpoint
DROP TABLE "questions" CASCADE;--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "questions" json NOT NULL;