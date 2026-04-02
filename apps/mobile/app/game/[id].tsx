import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Share } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card-header';
import { CardContent } from '@/components/ui/card-content';
import { useGameReview } from '@/hooks/use-game-review';
import { useGoToNextQuestion } from '@/hooks/use-go-to-next-question';

const SimpleQRCode = ({ value }: { value: string }) => {
  const size = 150;
  const backgroundColor = 'white';
  const modules = generateQRMatrix(value);

  return (
    <View style={[styles.qrContainer, { backgroundColor, padding: 8, borderRadius: 8 }]}>
      <Svg width={size} height={size}>
        {modules.map((row, rowIndex) =>
          row.map((isBlack, colIndex) => (
            isBlack && (
              <Rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * 5}
                y={rowIndex * 5}
                width={5}
                height={5}
                color="black"
              />
            )
          ))
        )}
      </Svg>
    </View>
  );
};

function generateQRMatrix(data: string): boolean[][] {
  const size = 25;
  const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i < 7 && j < 7) matrix[i][j] = true;
      else if (i < 7 && j > size - 8) matrix[i][j] = true;
      else if (i > size - 8 && j < 7) matrix[i][j] = true;
      else if (i % 2 === 0) matrix[i][j] = (i + j) % 3 === 0;
    }
  }

  const hash = data.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  for (let i = 0; i < 100; i++) {
    const row = Math.abs(hash * (i + 1)) % size;
    const col = Math.abs(hash * (i + 2)) % size;
    matrix[row][col] = !matrix[row][col];
  }

  return matrix;
}

export default function ObserveGamePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const game = useGameReview(id);
  const goToNextQuestion = useGoToNextQuestion(id);

  const copyGameLink = async () => {
    try {
      await Share.share({
        message: `Join my quiz game: exp://mobile/play/${id}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!game) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Connecting...</Text>
      </View>
    );
  }

  const prevQuestion = game.quiz.questions[game.currentQuestionIndex - 1];
  const prevAnswers = game.answers[game.currentQuestionIndex - 1];
  const prevQuestionCorrectAnswers = prevQuestion?.answers
    .map((answer, index) => ({ ...answer, index }))
    .filter((answer) => answer.isCorrect);

  const currentQuestion = game.quiz.questions[game.currentQuestionIndex];
  const answers = game.answers[game.currentQuestionIndex];

  return (
    <>
      <Stack.Screen options={{ title: 'Game Host' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Card style={styles.card}>
          <CardHeader>
            <Text style={styles.playerCount}>
              Players connected - {game.playersAmount || 0}
            </Text>
          </CardHeader>
          <CardContent>
            <Text style={styles.questionText}>
              {currentQuestion?.question || 'It was the last question'}
            </Text>
            <View style={styles.answerList}>
              {currentQuestion?.answers.map((answer, index) => (
                <Text key={index} style={styles.answerItem}>
                  {answer.answer} ({answers?.[index] || 0})
                </Text>
              ))}
            </View>
            <Button
              onPress={() => goToNextQuestion.mutate()}
              disabled={goToNextQuestion.isPending}
              style={styles.nextButton}
            >
              Go to next question
            </Button>
          </CardContent>
        </Card>

        {prevQuestion && (
          <Card style={styles.card}>
            <CardHeader>
              <Text style={styles.prevQuestionText}>{prevQuestion.question}</Text>
            </CardHeader>
            <CardContent>
              <Text style={styles.correctLabel}>Correct answers: </Text>
              <View style={styles.answerList}>
                {prevQuestionCorrectAnswers?.map((answer) => (
                  <Text key={answer.index} style={styles.answerItem}>
                    {answer.answer} ({prevAnswers?.[answer.index] || 0})
                  </Text>
                ))}
              </View>
            </CardContent>
          </Card>
        )}

        <View style={styles.qrSection}>
          <SimpleQRCode value={`exp://mobile/play/${id}`} />
          <View style={styles.qrButtons}>
            <Button onPress={() => goToNextQuestion.mutate()}>
              Join the game
            </Button>
            <Button variant="outline" onPress={copyGameLink}>
              Copy Link
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    color: '#374151',
  },
  card: {
    width: '100%',
    marginBottom: 8,
  },
  playerCount: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
  },
  questionText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  prevQuestionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
  },
  answerList: {
    gap: 4,
  },
  answerItem: {
    fontSize: 16,
    color: '#4b5563',
  },
  correctLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  nextButton: {
    marginTop: 12,
  },
  qrSection: {
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrButtons: {
    flexDirection: 'row',
    gap: 8,
  },
});
