import { View, Text, StyleSheet, Button } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

export default function BlockedScreen() {
  const params = useLocalSearchParams();

  const appName =
    typeof params.app === "string"
      ? params.app
      : "This app";

  return (
    <View style={styles.container}>
      <Text style={styles.lock}>🔒</Text>

      <Text style={styles.title}>
        App blocked
      </Text>

      <Text style={styles.appName}>
        {appName}
      </Text>

      <Text style={styles.message}>
        This app is currently unavailable.
      </Text>

      <Button
        title="Go back"
        onPress={() => router.replace("/")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#111111",
  },

  lock: {
    fontSize: 60,
    marginBottom: 25,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },

  appName: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 15,
  },

  message: {
    fontSize: 17,
    color: "#BBBBBB",
    textAlign: "center",
    marginBottom: 30,
  },
});