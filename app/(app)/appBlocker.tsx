import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

import {
  getInstalledApps,
  setBlockedApps,
  getBlockedApps,
  clearAllBlocks,
  temporaryUnlock,
} from "expo-app-blocker";

// Apps that we NEVER want to block.
const ESSENTIAL_APPS = [
  "com.android.settings",
  "com.google.android.dialer",
  "com.google.android.contacts",

  // IMPORTANT:
  // Add your own application's package name here.
  "com.mycompany.myblocker",
];

export default function App() {
  const [blocked, setBlocked] = useState(true);
  const [conditionDone, setConditionDone] = useState(false);
  const [blockedCount, setBlockedCount] = useState(0);

  useEffect(() => {
    blockNonEssentialApps();
  }, []);

  async function blockNonEssentialApps() {
    // 1. Get all installed apps
    const installedApps = await getInstalledApps();

    // 2. Remove apps that we consider essential
    const appsToBlock = installedApps.filter(
      (app) => !ESSENTIAL_APPS.includes(app.packageName)
    );

    // 3. Get just the package names
    const packageNames = appsToBlock.map(
      (app) => app.packageName
    );

    // 4. Tell the native blocker to block them
    await setBlockedApps(packageNames);

    // 5. Update our React state
    setBlockedCount(packageNames.length);
    setBlocked(true);
    setConditionDone(false);

    console.log("Blocked apps:", appsToBlock);
  }

  async function completeCondition() {
    // Example condition:
    // User must wait 10 seconds.

    await new Promise((resolve) => {
      setTimeout(resolve, 10_000);
    });

    // Condition is complete
    setConditionDone(true);

    // Give the user 5 minutes of access
    await temporaryUnlock(5);

    setBlocked(false);
  }

  async function blockAgain() {
    await blockNonEssentialApps();
  }

  async function unblockEverything() {
    await clearAllBlocks();

    setBlocked(false);
    setBlockedCount(0);
  }

  return (
    <View style={{ padding: 40 }}>
      <Text style={{ fontSize: 24 }}>
        App Blocker
      </Text>

      <Text style={{ marginVertical: 20 }}>
        Apps blocked: {blockedCount}
      </Text>

      <Text style={{ marginBottom: 20 }}>
        Status: {blocked ? "BLOCKED" : "UNBLOCKED"}
      </Text>

      {blocked && !conditionDone && (
        <Button
          title="Complete condition"
          onPress={completeCondition}
        />
      )}

      {!blocked && (
        <Button
          title="Block apps again"
          onPress={blockAgain}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button
          title="Emergency: clear all blocks"
          onPress={unblockEverything}
        />
      </View>
    </View>
  );
}