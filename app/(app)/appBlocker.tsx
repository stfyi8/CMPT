import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import {
  getPermissionStatus,
  requestPermissions,
  setBlockConfiguration,
  getBlockConfiguration,
  clearAllBlocks,
  temporaryUnlock,
  isTemporarilyUnlocked,
  getRemainingUnlockTime,
  relockApps,
  addPendingUnlockListener,
  checkAndClearPendingUnlock,
  FamilyActivityPickerView,
  type PermissionStatus,
  type IOSBlockedItem,
  type FamilyActivityPickerSelectionEvent,
} from 'expo-app-blocker';

export default function appBlocker() {
  const [permissions, setPermissions] = useState<PermissionStatus | null>(null);
  const [blockedApps, setBlockedApps] = useState<IOSBlockedItem[]>([]);
  const [selectionData, setSelectionData] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  // Load permissions and existing blocks on mount
  useEffect(() => {
    getPermissionStatus().then(setPermissions);
    const config = getBlockConfiguration();
    if (config?.blockedItems?.length) {
      setBlockedApps(config.blockedItems);
    }
  }, []);

  // Listen for shield button taps
  useEffect(() => {
    if (checkAndClearPendingUnlock()) {
      // User tapped shield button while app was closed
    }
    const sub = addPendingUnlockListener(() => {
      // User tapped shield button — show your unlock UI
    });
    return () => sub?.remove();
  }, []);

  // Handle inline picker selection
  const handleSelectionChange = async (event: FamilyActivityPickerSelectionEvent) => {
    const items = event.items.filter(i => i.type !== 'summary');
    setBlockedApps(items);
    setSelectionData(event.selectionData);

    if (items.length > 0) {
      await setBlockConfiguration({ blockedItems: items, isActive: false });
    } else {
      clearAllBlocks();
    }
  };

  if (Platform.OS !== 'ios') return null;

  return (
    <View style={styles.container}>
      {/* Permission request */}
      {!permissions?.allGranted && (
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            const result = await requestPermissions();
            setPermissions(result);
          }}
        >
          <Text style={styles.buttonText}>Enable Screen Time</Text>
        </TouchableOpacity>
      )}

      {/* Inline app picker */}
      {permissions?.allGranted && (
        <View style={styles.pickerContainer}>
          <FamilyActivityPickerView
            initialSelection={selectionData}
            onSelectionChange={handleSelectionChange}
            theme="light"
            style={{ height: 500 }}
          />
        </View>
      )}

      {/* Actions */}
      {blockedApps.length > 0 && (
        <View style={styles.actions}>
          <Text>{blockedApps.length} apps blocked</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await temporaryUnlock(15);
              setUnlocked(true);
            }}
          >
            <Text style={styles.buttonText}>Unlock 15 min</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => { clearAllBlocks(); setBlockedApps([]); }}
          >
            <Text style={styles.buttonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  pickerContainer: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8' },
  actions: { marginTop: 16, gap: 12 },
  button: { backgroundColor: '#fb6107', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});