import { useRouter } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello there, in BrainWave!</Text>
      <View style={styles.buttonContainer}>
        <Button onPress={() => router.push("/create")}>Create a quiz</Button>
      </View>
    </View>
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
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    gap: 8,
  },
});
