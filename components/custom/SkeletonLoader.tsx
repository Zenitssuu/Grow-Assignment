// src/screens/SkeletonLoader.tsx
import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet, Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SkeletonLoader() {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerTranslate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View style={{ padding: 16 }}>
      {/* Company Card Skeleton */}
      <View style={styles.row}>
        <View style={styles.circle} />
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <View style={styles.line} />
          <View style={[styles.line, { width: 100, marginTop: 6 }]} />
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <View style={[styles.line, { width: 60, height: 18 }]} />
          <View
            style={[styles.line, { width: 40, height: 12, marginTop: 6 }]}
          />
        </View>
      </View>

      {/* Description */}
      <View style={[styles.box, { height: 80 }]} />

      {/* Tags */}
      <View style={styles.row}>
        <View style={[styles.tag]} />
        <View style={[styles.tag, { width: 120 }]} />
      </View>

      {/* Metrics Row */}
      <View style={styles.metricRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={i} style={styles.metricBlock} />
        ))}
      </View>

      {/* Shimmer Effect Overlay */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX: shimmerTranslate }],
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e0e0e0",
  },
  line: {
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    width: 160,
  },
  box: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 16,
  },
  tag: {
    height: 28,
    width: 100,
    borderRadius: 14,
    backgroundColor: "#e0e0e0",
    marginRight: 8,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  metricBlock: {
    width: 50,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
});
