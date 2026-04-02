import { MaterialCommunityIcons } from "@expo/vector-icons";
import { randomUUID } from "expo-crypto";
import type { FC } from "react";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AnswerInput } from "./AnswerInput";
import type { Answer, Question } from "./interface";

interface Props {
  question: Question;
  onRemove: () => void;
  onChange: (question: Question) => void;
}

export const QuestionInput: FC<Props> = ({ question, onRemove, onChange }) => {
  const [inputValue, setInputValue] = useState(question.question);

  const onQuestionChange = (value: string) => {
    setInputValue(value);
    onChange({
      ...question,
      question: value,
    });
  };

  const addAnswer = () => {
    onChange({
      ...question,
      answers: [
        ...question.answers,
        {
          id: randomUUID(),
          answer: "",
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
    <View style={styles.container}>
      <Field style={styles.questionField}>
        <Input
          placeholder="Question..."
          value={inputValue}
          onChangeText={onQuestionChange}
        />
        {question.answers.map((answer) => (
          <AnswerInput
            key={answer.id}
            answer={answer}
            onRemove={removeAnswer(answer.id)}
            onChange={onAnswerChange}
          />
        ))}
        <View style={styles.buttonRow}>
          <Button variant="destructive" onPress={onRemove}>
            <MaterialCommunityIcons name="delete" size={20} color="white" />
            Remove question
          </Button>
          <Button variant="outline" onPress={addAnswer}>
            Add answer
          </Button>
        </View>
      </Field>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 16,
  },
  questionField: {
    gap: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
});
