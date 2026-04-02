import { server } from "@/lib/server";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const [data, setData] = useState<unknown>();

  useEffect(() => {
    server.health.get().then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Data:</Text>
      <Text>{JSON.stringify(data)}</Text>
    </View>
  );
}
