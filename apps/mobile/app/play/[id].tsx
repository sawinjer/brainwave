import { useLocalSearchParams, Stack } from "expo-router";
import { randomUUID } from "expo-crypto";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/hooks/use-game-state";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function PlayGamePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [playerName] = useLocalStorage("playerName", randomUUID());
  const { state, vote } = useGameState(id, playerName);

  if (!state) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Connecting...</Text>
      </View>
    );
  }

  const currentQuestion = state.quiz.questions[state.currentQuestionIndex];

  return (
    <>
      <Stack.Screen options={{ title: "Quiz Game" }} />
      <View style={styles.container}>
        <Text style={styles.questionText}>
          {currentQuestion?.question || "Quiz finished"}
        </Text>
        <View style={styles.answerList}>
          {currentQuestion?.answers.map((answer, index) => (
            <Button
              style={styles.answerButton}
              variant={
                state.answers[state.currentQuestionIndex] === index
                  ? "default"
                  : "outline"
              }
              onPress={() => vote(index)}
              key={index}
            >
              {answer.answer}
            </Button>
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 24,
    color: "#374151",
  },
  questionText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 24,
  },
  answerList: {
    gap: 12,
    width: "100%",
    maxWidth: 300,
  },
  answerButton: {
    minWidth: 150,
  },
});
