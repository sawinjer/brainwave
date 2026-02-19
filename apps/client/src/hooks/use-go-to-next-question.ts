import { useMutation } from "@tanstack/react-query";
import { server } from "@/lib/server";

export const useGoToNextQuestion = (gameId: string) => {
  return useMutation({
    mutationFn: async () => {
      await server.game({ gameId })["next-question"].post();
    },
  });
};
