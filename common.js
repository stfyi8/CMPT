import { Platform } from "react-native";
import { setBlockedApps, clearAllBlocks } from "expo-app-blocker";

export const getRoomId = (userId1) => {
  const sortedIds = [userId1].sort();
  const roomId = sortedIds.join('_');
  return roomId;
}

/**
 * A reminder counts as "complete" once there is nothing left to check:
 * every task has its checkbox ticked, or the reminder has no tasks at all.
 * Used to decide when the blocker should stay armed.
 */
export const isReminderComplete = (reminder) => {
  if (!reminder?.checker) return false;
  const taskCount = reminder.tasks?.length ?? reminder.checker.length;
  if (taskCount === 0) return true;
  return reminder.checker.length > 0 && reminder.checker.every(Boolean);
};

/**
 * Platform-aware unblock. `clearAllBlocks()` is a no-op on Android
 * (expo-app-blocker only implements it for iOS), so Android has to clear
 * the persisted blocked-package list through `setBlockedApps([])` instead.
 */
export const unblockApps = () => {
  if (Platform.OS === "android") {
    setBlockedApps([]);
    return;
  }
  clearAllBlocks();
};