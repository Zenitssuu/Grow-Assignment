import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

export default function BiometricAuth({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        setError("Biometric authentication not available.");
        setLoading(false);
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate",
      });
      setLoading(false);
      if (result.success) {
        onSuccess();
      } else {
        setError("Authentication failed. Please try again.");
      }
    })();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  if (error) return <View style={styles.center}><Text>{error}</Text></View>;
  return <View />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
