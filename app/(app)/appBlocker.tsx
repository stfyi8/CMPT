import React, { useEffect, useState, useMemo } from "react";
import {
  Alert,
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  getBlockedApps,
  getInstalledApps,
  openOverlaySettings,
  openUsageStatsSettings,
  setBlockedApps,
  startMonitoring,
  clearAllBlocks,
} from "expo-app-blocker";

type InstalledApp = Awaited<
  ReturnType<typeof getInstalledApps>
>[number];

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const ESSENTIAL_PACKAGES = new Set([
  "com.android.settings",
  "com.android.systemui",
  "com.google.android.dialer",
  "com.android.dialer",
  "com.android.launcher",
  "com.stfyi.CMPT",
  "com.android.camera2",
  "com.google.android.apps.photos",
  "com.google.apps.gm",
  "com.google.android.calendar",
  "com.google.android.deskclock",
  "com.google.android.contacts",
  "com.google.android.apps.docs",
  "com.google.android.documentsui",
  "com.google.android.gm",
  "com.android.vending",
  "com.google.android.apps.maps",
  // "com.google.android.apps.messaging",
  "com.google.android.apps.safetyhub",
  "com.android.stk",
]);

const INITIAL_TODOS: Todo[] = [
  { id: "1", title: "Complete your planned task", completed: false },
  { id: "2", title: "Review your notes", completed: false },
  { id: "3", title: "Prepare for tomorrow", completed: false },
];

export default function App() {
  const [installedApps, setInstalledApps] = useState<InstalledApp[]>([]);
  const [blockedApps, setBlockedApps] = useState<string[]>([]);
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS);
  const [loading, setLoading] = useState(true);

  const allTodosCompleted = useMemo(
    () => todos.length > 0 && todos.every((todo) => todo.completed),
    [todos]
  );

  // Load apps when the screen starts.
  useEffect(() => {
    initialize();
  }, []);

  // Runs after initialization and whenever the installed-app list changes.
  useEffect(() => {
    if (installedApps.length === 0) return;

    let cancelled = false;

    async function blockAllNonEssentialApps() {
      try {
        const packagesToBlock = installedApps
          .map((app) => app.packageName)
          .filter(
            (packageName) => !ESSENTIAL_PACKAGES.has(packageName)
          );

        console.log("Blocking non-essential apps:", packagesToBlock);

        await setBlockedApps(packagesToBlock);
        await startMonitoring();

        if (!cancelled) {
          setBlockedApps(packagesToBlock);
        }
      } catch (error) {
        console.error("Failed to block apps:", error);

        if (!cancelled) {
          Alert.alert("Error", "Unable to block non-essential apps.");
        }
      }
    }

    blockAllNonEssentialApps();

    return () => {
      cancelled = true;
    };
  }, [installedApps]);

  async function initialize() {
    try {
      setLoading(true);

      const apps = await getInstalledApps();
      const existingBlockedApps = await getBlockedApps();

      setBlockedApps(existingBlockedApps);
      setInstalledApps(apps);

      await startMonitoring();

      console.log(
        "Installed apps:",
        apps.map((app) => app.packageName)
      );
    } catch (error) {
      console.error("Failed to initialize app blocker:", error);
      Alert.alert("Error", "Unable to initialize the app blocker.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (allTodosCompleted) {
      unlockApps();
    }
  }, [allTodosCompleted]);

  async function unlockApps() {
    try {
      await clearAllBlocks();
      setBlockedApps([]);
      Alert.alert("Tasks completed", "All apps have been unlocked.");
    } catch (error) {
      console.error("Failed to unlock apps:", error);
      Alert.alert("Error", "Unable to unlock apps.");
    }
  }

  function toggleTodo(id: string) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Focus Blocker</Text>

      <Text style={styles.description}>
        All non-essential apps are blocked automatically.
      </Text>

      <Text style={styles.sectionTitle}>Permissions</Text>

      <Button
        title="Enable Usage Access"
        onPress={openUsageStatsSettings}
      />

      <View style={styles.gap} />

      <Button
        title="Enable Display Over Other Apps"
        onPress={openOverlaySettings}
      />

      <Text style={styles.sectionTitle}>Todo List</Text>

      {todos.map((todo) => (
        <Pressable
          key={todo.id}
          style={styles.todo}
          onPress={() => toggleTodo(todo.id)}
        >
          <Text style={styles.checkbox}>
            {todo.completed ? "☑" : "☐"}
          </Text>

          <Text
            style={[
              styles.todoText,
              todo.completed && styles.completedTodo,
            ]}
          >
            {todo.title}
          </Text>
        </Pressable>
      ))}

      <Text style={styles.sectionTitle}>
        Currently Blocked ({blockedApps.length})
      </Text>

      {loading ? (
        <Text>Loading apps...</Text>
      ) : blockedApps.length === 0 ? (
        <Text>Nothing is blocked.</Text>
      ) : (
        blockedApps.map((packageName) => (
          <Text key={packageName} style={styles.app}>
            {packageName}
          </Text>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    paddingTop: 60,
    paddingBottom: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 15,
  },
  todo: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  checkbox: {
    fontSize: 26,
    marginRight: 10,
  },
  todoText: {
    fontSize: 17,
  },
  completedTodo: {
    textDecorationLine: "line-through",
    color: "#777",
  },
  app: {
    paddingVertical: 5,
    fontSize: 14,
  },
  gap: {
    height: 10,
  },
});