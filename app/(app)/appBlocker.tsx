import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import {
  getInstalledApps,
  getBlockedApps,
  setBlockedApps,
  clearAllBlocks,
  openOverlaySettings,
  openUsageStatsSettings,
  startMonitoring,
  stopMonitoring,
} from "expo-app-blocker";

type InstalledApp = Awaited<
  ReturnType<typeof getInstalledApps>
>[number];

export async function startAppBlocker() {
  await setBlockedApps([
    "com.google.android.youtube",
  ]);

  await startMonitoring();

  console.log("YouTube blocker started");
}

export default function App() {
  const [installedApps, setInstalledApps] = useState<InstalledApp[]>([]);
  const [blockedApps, setBlockedAppsState] = useState<string[]>([]);
  const [youtubeInstalled, setYoutubeInstalled] = useState(false);

   useEffect(() => {
    startAppBlocker();
  }, []);

  useEffect(() => {
    initialize();
    
    return () => {
      // Don't stop the service here in production,
      // because we want blocking to continue when
      // this app goes into the background.
    };
  }, []);


  async function initialize() {
  try {
    console.log("=== BLOCKER TEST ===");

    const apps = await getInstalledApps();

    const youtube = apps.find(
      (app) =>
        app.packageName === "com.google.android.youtube"
    );

    console.log("YouTube found:", youtube);

    const before = await getBlockedApps();

    console.log("Blocked BEFORE:", before);

    await setBlockedApps([
      "com.google.android.youtube",
    ]);

    const after = await getBlockedApps();

    console.log("Blocked AFTER:", after);

    await startMonitoring();

    console.log("Monitoring started");

    setInstalledApps(apps);
    setBlockedAppsState(after);
  } catch (error) {
    console.error("=== BLOCKER ERROR ===");
    console.error(error);
  }
}
  async function loadApps() {
    try {
      // Get installed apps
      const apps = await getInstalledApps();

      console.log("Installed apps:", apps);

      setInstalledApps(apps);

      // Check whether YouTube exists
      const youtube = apps.find(
        (app) =>
          app.packageName === "com.google.android.youtube"
      );

      console.log("YouTube:", youtube);

      setYoutubeInstalled(!!youtube);

      // Get current blocked apps
      const blocked = await getBlockedApps();

      console.log("Currently blocked:", blocked);

      setBlockedAppsState(blocked);
    } catch (error) {
      console.error("Failed to load apps:", error);
    }
  }

  async function blockYouTube() {
    try {
      console.log("Blocking YouTube...");

      const youtubePackage =
        "com.google.android.youtube";

      // Check whether YouTube is installed
      const apps = await getInstalledApps();

      const youtube = apps.find(
        (app) =>
          app.packageName === youtubePackage
      );

      if (!youtube) {
        Alert.alert(
          "YouTube not found",
          "YouTube is not installed on this Android emulator."
        );

        console.log(
          "YouTube package was not found:",
          youtubePackage
        );

        return;
      }

      console.log(
        "Found YouTube:",
        youtube
      );

      // Block YouTube
      await setBlockedApps([
        youtubePackage,
      ]);

      // Read the list back
      const blocked = await getBlockedApps();

      console.log(
        "Blocked apps after update:",
        blocked
      );

      setBlockedAppsState(blocked);

      Alert.alert(
        "YouTube blocked",
        "YouTube has been added to the blocked apps list."
      );
    } catch (error) {
      console.error(
        "Failed to block YouTube:",
        error
      );

      Alert.alert(
        "Error",
        "Failed to block YouTube. Check the console."
      );
    }
  }

  async function clearBlocks() {
    try {
      await clearAllBlocks();

      const blocked = await getBlockedApps();

      console.log(
        "Blocked apps after clearing:",
        blocked
      );

      setBlockedAppsState(blocked);

      Alert.alert(
        "Blocks cleared",
        "All blocked apps have been removed."
      );
    } catch (error) {
      console.error(
        "Failed to clear blocks:",
        error
      );
    }
  }

  async function refreshApps() {
    await loadApps();
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>
        YouTube Blocker
      </Text>

      <Text style={styles.description}>
        Android app blocker test
      </Text>

      {/* Permissions */}

      <Text style={styles.sectionTitle}>
        1. Android Permissions
      </Text>

      <Button
        title="Enable Usage Access"
        onPress={openUsageStatsSettings}
      />

      <View style={styles.gap} />

      <Button
        title="Enable Display Over Other Apps"
        onPress={openOverlaySettings}
      />

      {/* YouTube */}

      <Text style={styles.sectionTitle}>
        2. YouTube
      </Text>

      <Text style={styles.status}>
        YouTube installed:{" "}
        {youtubeInstalled ? "YES" : "NO"}
      </Text>

      <View style={styles.gap} />

      <Button
        title="Block YouTube"
        onPress={blockYouTube}
      />

      <View style={styles.gap} />

      <Button
        title="Refresh"
        onPress={refreshApps}
      />

      {/* Blocked apps */}

      <Text style={styles.sectionTitle}>
        3. Currently Blocked
      </Text>

      {blockedApps.length === 0 ? (
        <Text style={styles.normalText}>
          Nothing is blocked.
        </Text>
      ) : (
        blockedApps.map((packageName) => (
          <Text
            key={packageName}
            style={styles.app}
          >
            {packageName}
          </Text>
        ))
      )}

      <View style={styles.gap} />

      <Button
        title="Clear All Blocks"
        onPress={clearBlocks}
      />

      {/* Installed apps */}

      <Text style={styles.sectionTitle}>
        4. Installed Apps
      </Text>

      {installedApps.slice(0, 30).map((app) => (
        <Text
          key={app.packageName}
          style={styles.app}
        >
          {app.name}{" "}
          —{" "}
          {app.packageName}
        </Text>
      ))}
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

  status: {
    fontSize: 17,
    marginBottom: 10,
  },

  normalText: {
    fontSize: 16,
  },

  app: {
    paddingVertical: 5,
    fontSize: 14,
  },

  gap: {
    height: 10,
  },
});

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Button,
//   StyleSheet,
//   ScrollView,
// } from "react-native";

// import {
//   getInstalledApps,
//   getBlockedApps,
//   setBlockedApps,
//   clearAllBlocks,
//   openOverlaySettings,
//   openUsageStatsSettings,
// } from "expo-app-blocker";

// export default function App() {
//     const [installedApps, setInstalledApps] =
//     useState<Awaited<ReturnType<typeof getInstalledApps>>>([]);

//   const [blockedApps, setBlockedAppsState] =
//     useState<Awaited<ReturnType<typeof getBlockedApps>>>([]);

//   useEffect(() => {
//     loadApps();
//   }, []);



//   async function loadApps() {
//     try {
//       const apps = await getInstalledApps();

//       console.log("Installed apps:", apps);

//       setInstalledApps(apps);

//       const blocked = await getBlockedApps();

//       console.log("Currently blocked:", blocked);

//       setBlockedAppsState(blocked);
//     } catch (error) {
//       console.error("Failed to load apps:", error);
//     }
//   }

//   async function blockYouTube() {
//     try {
//       await setBlockedApps([
//         "com.google.android.youtube",
//       ]);

//       const blocked = await getBlockedApps();

//       console.log("Blocked apps after update:", blocked);

//       setBlockedAppsState(blocked);
//     } catch (error) {
//       console.error("Failed to block app:", error);
//     }
//   }

//   async function blockInstagram() {
//     try {
//       await setBlockedApps([
//         "com.instagram.android",
//       ]);

//       const blocked = await getBlockedApps();

//       console.log("Blocked apps:", blocked);

//       setBlockedAppsState(blocked);
//     } catch (error) {
//       console.error("Failed to block app:", error);
//     }
//   }

//   async function clearBlocks() {
//     try {
//       await clearAllBlocks();

//       const blocked = await getBlockedApps();

//       console.log("Blocked apps after clearing:", blocked);

//       setBlockedAppsState(blocked);
//     } catch (error) {
//       console.error("Failed to clear blocks:", error);
//     }
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>
//         Android App Blocker
//       </Text>

//       <Text style={styles.sectionTitle}>
//         Permissions
//       </Text>

//       <Button
//         title="Enable Usage Access"
//         onPress={openUsageStatsSettings}
//       />

//       <View style={styles.gap} />

//       <Button
//         title="Enable Display Over Other Apps"
//         onPress={openOverlaySettings}
//       />

//       <Text style={styles.sectionTitle}>
//         Test Blocking
//       </Text>

//       <Button
//         title="Block YouTube"
//         onPress={blockYouTube}
//       />

//       <View style={styles.gap} />

//       <Button
//         title="Block Instagram"
//         onPress={blockInstagram}
//       />

//       <View style={styles.gap} />

//       <Button
//         title="Clear All Blocks"
//         onPress={clearBlocks}
//       />

//       <Text style={styles.sectionTitle}>
//         Currently Blocked
//       </Text>

//       {blockedApps.length === 0 ? (
//         <Text>
//           Nothing is blocked.
//         </Text>
//       ) : (
//         blockedApps.map((packageName) => (
//           <Text
//             key={packageName}
//             style={styles.app}
//           >
//             {packageName}
//           </Text>
//         ))
//       )}

//       <Text style={styles.sectionTitle}>
//         Installed Apps
//       </Text>

//       {installedApps.slice(0, 20).map((app) => (
//         <Text key={app.packageName}>
//           {app.name} — {app.packageName}
//         </Text>
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 30,
//     paddingTop: 60,
//   },

//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 30,
//   },

//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginTop: 30,
//     marginBottom: 15,
//   },

//   app: {
//     paddingVertical: 5,
//     fontSize: 15,
//   },

//   gap: {
//     height: 10,
//   },
// });
