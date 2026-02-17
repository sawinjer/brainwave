CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz" json NOT NULL,
	"answers" json NOT NULL,
	"current_question_index" integer DEFAULT 0 NOT NULL,
	"players_amount" integer DEFAULT 0 NOT NULL
);
