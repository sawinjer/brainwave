import { randomUUID } from "expo-crypto";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { FC } from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FieldGroup } from "@/components/ui/field-group";
import {
  FieldSet,
  FieldLegend,
  FieldDescription,
} from "@/components/ui/fieldset";
import { Input } from "@/components/ui/input";
import { filterQuestions } from "./filter-questions";
import type { Question, Quiz } from "./interface";
import { QuestionInput } from "./QuestionInput";

interface Props {
  loading?: boolean;
  initialValue?: Quiz;
  onSubmit: (quiz: Quiz) => void;
}

export const QuizForm: FC<Props> = (props) => {
  const [title, setTitle] = useState<string>(props.initialValue?.title || "");
  const [questions, setQuestions] = useState<Question[]>(
    props.initialValue?.questions || [],
  );
  const [hasError, setHasError] = useState(false);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: randomUUID(),
        question: "",
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
    setQuestions((prev) =>
      prev.filter((question) => question.id !== questionId),
    );
  };

  const onSubmit = () => {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <FieldGroup>
            <Field>
              <View style={styles.requiredLabel}>
                <Text style={styles.required}>*</Text>
                <Input
                  placeholder="Title of a quiz"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
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
              <Button variant="outline" onPress={addQuestion}>
                Add question
              </Button>
            </FieldGroup>
          </FieldSet>
          {hasError && (
            <Alert variant="destructive">
              <MaterialCommunityIcons
                name="alert-circle"
                size={20}
                color="#ef4444"
              />
              <AlertTitle>No valid questions</AlertTitle>
              <AlertDescription>
                This form requires at least one question with one answer filled
              </AlertDescription>
            </Alert>
          )}
          <Button onPress={onSubmit} disabled={props.loading}>
            Submit
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    gap: 16,
    padding: 16,
  },
  requiredLabel: {
    flexDirection: "column",
  },
  required: {
    color: "#ef4444",
    fontSize: 16,
  },
});
