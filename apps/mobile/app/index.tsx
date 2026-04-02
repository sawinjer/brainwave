import { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from "react-native";
import { Button } from "@/components/ui/button";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function Home() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleJoin = () => {
    if (!gameCode.trim()) {
      Alert.alert("Error", "Please enter a game code");
      return;
    }
    router.push(`/play/${gameCode.trim()}`);
  };

  const handleScan = () => {
    if (!permission?.granted) {
      requestPermission().then((result) => {
        if (result.granted) {
          setShowScanner(true);
        }
      });
    } else {
      setShowScanner(true);
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setShowScanner(false);
    if (data) {
      router.push(`/play/${data}`);
    }
  };

  if (showScanner) {
    return (
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        >
          <View style={styles.overlay}>
            <Text style={styles.scanText}>Scan QR code</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowScanner(false)}
            >
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

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
            <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
              <Text style={styles.scanButtonText}>📷</Text>
            </TouchableOpacity>
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
