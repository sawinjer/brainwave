export interface Quiz {
	title: string;
	questions: Question[];
}

export interface Question {
	id: string;
	question: string;
	answers: Answer[];
}

export interface Answer {
	id: string;
	answer: string;
	isCorrect: boolean;
}
