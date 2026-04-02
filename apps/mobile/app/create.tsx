import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { QuizForm } from '@/components/forms/QuizForm/QuizForm';
import { useCreateQuiz } from '@/hooks/use-create-quiz';
import type { Quiz } from '@/components/forms/QuizForm/interface';

export default function CreateQuiz() {
  const router = useRouter();
  const createQuiz = useCreateQuiz();

  const handleSubmit = async (quiz: Quiz) => {
    try {
      const result = await createQuiz.mutateAsync(quiz);
      if (result?.quizId) {
        router.push(`/quiz/${result.quizId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <QuizForm onSubmit={handleSubmit} loading={createQuiz.isPending} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
