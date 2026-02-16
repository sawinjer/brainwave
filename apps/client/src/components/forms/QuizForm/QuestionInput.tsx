import { TrashIcon } from '@phosphor-icons/react';
import { nanoid } from 'nanoid';
import type React from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { updateInputValue } from '@/lib/update-input-value';
import { AnswerInput } from './AnswerInput';
import type { Answer, Question } from './interface';

interface Props {
	question: Question;
	onRemove: () => void;
	onChange: (question: Question) => void;
}

export const QuestionInput: React.FC<Props> = (props) => {
	const { question, onRemove, onChange } = props;

	const onQuestionChange = updateInputValue((questionTitle) => {
		onChange({
			...question,
			question: questionTitle,
		});
	});

	const addAnswer = () => {
		onChange({
			...question,
			answers: [
				...question.answers,
				{
					id: nanoid(),
					answer: '',
					isCorrect: false,
				},
			],
		});
	};

	const removeAnswer = (answerId: string) => () => {
		onChange({
			...question,
			answers: question.answers.filter((answer) => answer.id !== answerId),
		});
	};

	const onAnswerChange = (updatedAnswer: Answer) => {
		onChange({
			...question,
			answers: question.answers.map((answer) => {
				if (answer.id !== updatedAnswer.id) {
					return answer;
				}

				return updatedAnswer;
			}),
		});
	};

	return (
		<FieldGroup>
			<Field className="border-b-muted border-b-[1px] pb-4">
				<FieldLabel>Question</FieldLabel>
				<Input
					placeholder="Quesetion..."
					value={question.question || ''}
					onChange={onQuestionChange}
				/>
				{question.answers.map((answer) => (
					<AnswerInput
						key={answer.id}
						answer={answer}
						onRemove={removeAnswer(answer.id)}
						onChange={onAnswerChange}
					/>
				))}
				<div className="flex items-center gap-2">
					<Button type="button" variant="destructive" onClick={onRemove}>
						<TrashIcon />
						Remove question
					</Button>
					<Button variant="outline" type="button" onClick={addAnswer}>
						Add answer
					</Button>
				</div>
			</Field>
		</FieldGroup>
	);
};
