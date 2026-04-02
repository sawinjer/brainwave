import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { FC } from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface Answer {
	id: string;
	answer: string;
	isCorrect: boolean;
}

interface Props {
	answer: Answer;
	onRemove: () => void;
	onChange: (answer: Answer) => void;
}

export const AnswerInput: FC<Props> = ({ answer, onChange, onRemove }) => {
	const [inputValue, setInputValue] = useState(answer.answer);

	const onAnswerChange = (value: string) => {
		setInputValue(value);
		onChange({
			...answer,
			answer: value,
		});
	};

	const onIsCorrectToggle = () => {
		onChange({
			...answer,
			isCorrect: !answer.isCorrect,
		});
	};

	return (
		<View style={styles.container}>
			<View style={styles.inputRow}>
				<Input
					placeholder="Answer..."
					value={inputValue}
					onChangeText={onAnswerChange}
					style={styles.input}
				/>
				<Button
					variant="destructive"
					onPress={onRemove}
					size="icon"
				>
					<MaterialCommunityIcons name="delete" size={20} color="white" />
				</Button>
			</View>
			<View style={styles.checkboxRow}>
				<Text style={styles.label}>Is correct?</Text>
				<Checkbox
					checked={answer.isCorrect}
					onCheckedChange={onIsCorrectToggle}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: 4,
	},
	inputRow: {
		flexDirection: 'row',
		gap: 8,
		alignItems: 'center',
	},
	input: {
		flex: 1,
	},
	checkboxRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	label: {
		fontSize: 14,
		color: '#374151',
	},
});
