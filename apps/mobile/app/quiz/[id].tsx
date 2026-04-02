import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { QuizForm } from '@/components/forms/QuizForm/QuizForm';
import { Button } from '@/components/ui/button';
import { useGetQuiz } from '@/hooks/use-get-quiz';
import { useUpdateQuiz } from '@/hooks/use-update-quiz';
import { useLoading } from '@/hooks/use-loading';
import { server } from '@/lib/server';
import type { Quiz } from '@/components/forms/QuizForm/interface';

export default function EditQuizPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const quiz = useGetQuiz(id);
  const updateQuiz = useUpdateQuiz();
  const gameCreatingLoading = useLoading();

  const onSubmit = (quizData: Quiz) => {
    updateQuiz.mutate({
      ...quizData,
      id,
    });
  };

  const onStartGame = gameCreatingLoading.wrap(async () => {
    try {
      const response = await server.game.post({
        quizId: id,
      });

      const gameId = response.data;

      if (gameId) {
        router.push(`/game/${gameId}`);
      }
    } catch (error) {
      console.error(error);
    }
  });

  const handleDelete = () => {
    Alert.alert(
      'Delete Quiz',
      'Are you sure you want to delete this quiz?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            router.back();
          },
        },
      ]
    );
  };

  if (!quiz.data && !quiz.isPending) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Quiz not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: quiz.data?.title || 'Loading...' }} />
      <View style={styles.container}>
        <Text style={styles.title}>
          {quiz.data?.title || 'Loading...'}
        </Text>
        <View style={styles.actions}>
          <Text style={styles.actionLabel}>Actions: </Text>
          <Button disabled={gameCreatingLoading.value} onPress={onStartGame}>
            Start a quiz
          </Button>
          <Button variant="destructive" onPress={handleDelete}>
            <MaterialCommunityIcons name="delete" size={20} color="white" />
            Delete
          </Button>
        </View>
        <Text style={styles.subtitle}>Edit your quiz:</Text>
        {quiz.data && (
          <QuizForm
            initialValue={quiz.data}
            onSubmit={onSubmit}
            loading={updateQuiz.isPending}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6b7280',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#111827',
    padding: 16,
    paddingBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    flexWrap: 'wrap',
  },
  actionLabel: {
    fontSize: 14,
    color: '#374151',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    padding: 16,
    paddingTop: 8,
  },
});
