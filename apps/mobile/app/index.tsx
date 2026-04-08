import { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState("");

  const handleJoin = () => {
    if (!gameCode.trim()) {
      Alert.alert("Error", "Please enter a game code");
      return;
    }
    router.push(`/play/${gameCode.trim()}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello there, in BrainWave!</Text>
      <View style={styles.buttonContainer}>
        <Button onPress={() => router.push("/create")}>Create a quiz</Button>
        <View style={styles.joinSection}>
          <Text style={styles.joinLabel}>Or enter game code:</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter game code"
              value={gameCode}
              onChangeText={setGameCode}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <Button variant="outline" onPress={handleJoin}>
            Join game
          </Button>
        </View>
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
  joinSection: {
    marginTop: 16,
    alignItems: "center",
    gap: 8,
  },
  joinLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  input: {
    width: 160,
    height: 44,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
  },
  scanButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  scanButtonText: {
    fontSize: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  scanText: {
    color: "#ffffff",
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
  closeText: {
    color: "#111827",
    fontSize: 16,
  },
});
