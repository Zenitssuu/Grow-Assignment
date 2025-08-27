import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";

const { width } = Dimensions.get("window");
type RangeKey = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y";

export default function ChartSection() {
  const [activeRange, setActiveRange] = useState<RangeKey>("1D");
  // Animation state for chart fade
  const fadeAnim = useRef(new Animated.Value(1)).current;
  // Animation state for tab highlight
  const tabAnims = useRef(
    (['1D', '1W', '1M', '3M', '6M', '1Y'] as RangeKey[]).map(
      (key) => new Animated.Value(key === '1D' ? 1 : 0)
    )
  ).current;

  const handleRangeChange = (key: RangeKey) => {
    // Animate chart fade
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setActiveRange(key);
      // Animate tab highlight
      (['1D', '1W', '1M', '3M', '6M', '1Y'] as RangeKey[]).forEach((k, i) => {
        Animated.timing(tabAnims[i], {
          toValue: k === key ? 1 : 0,
          duration: 250,
          useNativeDriver: false,
        }).start();
      });
      // Animate chart fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.card}>
      {/* Full Width Chart */}
      <Animated.View style={[styles.chartPlaceholder, { opacity: fadeAnim }]}>
        <Text style={styles.chartHint}>Chart for {activeRange}</Text>
      </Animated.View>

      {/* Range Tabs in One Bar */}
      <View style={styles.rangeTabs}>
        {(["1D", "1W", "1M", "3M", "6M", "1Y"] as RangeKey[]).map((key, i) => {
          const active = activeRange === key;
          const bgColor = tabAnims[i].interpolate({
            inputRange: [0, 1],
            outputRange: ["#f2f2f2", "#007AFF"]
          });
          const textColor = tabAnims[i].interpolate({
            inputRange: [0, 1],
            outputRange: ["black", "#fff"]
          });
          return (
            <Pressable
              key={key}
              onPress={() => handleRangeChange(key)}
              style={{ flex: 1, alignItems: 'center', borderRadius: 6, overflow: 'hidden', marginHorizontal: 1 }}
            >
              <Animated.View style={[styles.tab, { backgroundColor: bgColor }]}> 
                <Animated.Text style={[styles.tabText, { color: textColor, fontWeight: active ? "900" : "800" }]}> 
                  {key}
                </Animated.Text>
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    marginVertical: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  chartPlaceholder: {
    width: width - 45, // Full width minus padding
    height: 220,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 12,
  },
  chartHint: {
    color: "#888",
  },
  rangeTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 50,
    backgroundColor: "#f2f2f2",
    // borderWidth:1,
    marginLeft:35,
    marginRight:35,
    paddingHorizontal:3
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal:10,
    alignItems: "center",
    borderRadius: 100,
  },
  tabActive: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
    // borderWidth:1
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "900",
  },
});
