import { TrashIcon } from '@phosphor-icons/react';
import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { updateInputValue } from '@/lib/update-input-value';
import type { Answer } from './interface';

interface Props {
	answer: Answer;
	onRemove: () => void;
	onChange: (answer: Answer) => void;
}

export const AnswerInput: React.FC<Props> = (props) => {
	const { answer, onChange, onRemove } = props;
	const id = useId();

	const onAnswerChange = updateInputValue((value) => {
		onChange({
			...answer,
			answer: value,
		});
	});

	const onIsCorrectToggle = () => {
		onChange({
			...answer,
			isCorrect: !answer.isCorrect,
		});
	};

	return (
		<div className="flex flex-col gap-1">
			<Field>
				<div className="flex gap-2 items-center">
					<Input
						placeholder="Answer..."
						value={answer.answer}
						onChange={onAnswerChange}
					/>

					<Button type="button" variant="destructive" onClick={onRemove} size="icon">
						<TrashIcon />
					</Button>
				</div>
			</Field>
			<Field className="w-fit" orientation="horizontal">
				<FieldLabel htmlFor={id}>Is correct?</FieldLabel>
				<Checkbox id={id} checked={answer.isCorrect} onClick={onIsCorrectToggle} />
			</Field>
		</div>
	);
};
