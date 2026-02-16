import { WarningCircleIcon } from '@phosphor-icons/react';
import { nanoid } from 'nanoid';
import type React from 'react';
import { useId, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { updateInputValue } from '@/lib/update-input-value';
import { filterQuestions } from './filter-questions';
import type { Question, Quiz } from './interface';
import { QuestionInput } from './QuestionInput';

interface Props {
	loading?: boolean;
	initialValue?: Quiz;
	onSubmit: (quiz: Quiz) => void;
}

export const QuizForm: React.FC<Props> = (props) => {
	const titleInputId = useId();
	const [title, setTitle] = useState<string>(props.initialValue?.title || '');
	const [questions, setQuestions] = useState<Question[]>(props.initialValue?.questions || []);
	const [hasError, setHasError] = useState(false);

	const addQuestion = () => {
		setQuestions((prev) => [
			...prev,
			{
				id: nanoid(),
				question: '',
				answers: [],
			},
		]);
	};

	const onQuestionChange = (updateQuestion: Question) => {
		setQuestions((prev) => {
			const newQuestions = prev.map((question) => {
				if (question.id !== updateQuestion.id) {
					return question;
				}

				return updateQuestion;
			});

			if (filterQuestions(newQuestions).length) {
				setHasError(false);
			}

			return newQuestions;
		});
	};

	const onRemoveQuestion = (questionId: string) => () => {
		setQuestions((prev) => prev.filter((question) => question.id !== questionId));
	};

	const onSubmit: React.SubmitEventHandler = (e) => {
		e.preventDefault();

		const questionsFiltered = filterQuestions(questions);

		if (!questionsFiltered.length) {
			setHasError(true);
			return;
		}

		const quiz = {
			title,
			questions: questionsFiltered,
		};

		props.onSubmit(quiz);
	};

	return (
		<form className="max-w-[560px] w-full flex flex-col gap-4" onSubmit={onSubmit}>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor={titleInputId}>
						<sup className="text-red-500">*</sup>Title
					</FieldLabel>
					<Input
						required
						id={titleInputId}
						placeholder="Title of a quiz"
						value={title}
						onChange={updateInputValue(setTitle)}
					/>
				</Field>
			</FieldGroup>
			<FieldSet>
				<FieldLegend>Questions</FieldLegend>
				<FieldDescription>Questions and answers for them</FieldDescription>
				<FieldGroup>
					{questions.map((question) => (
						<QuestionInput
							key={question.id}
							question={question}
							onChange={onQuestionChange}
							onRemove={onRemoveQuestion(question.id)}
						/>
					))}
					<Button variant="outline" type="button" onClick={addQuestion} className="w-fit">
						Add question
					</Button>
				</FieldGroup>
			</FieldSet>
			{hasError && (
				<Alert variant="destructive" className="w-full">
					<WarningCircleIcon />
					<AlertTitle>No valid questions</AlertTitle>
					<AlertDescription>
						This form requires at least one question with one answer filled
					</AlertDescription>
				</Alert>
			)}
			<Button type="submit" disabled={props.loading}>
				Submit
			</Button>
		</form>
	);
};
