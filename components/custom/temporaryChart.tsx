import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { day, daily } from "../../constants/Intraday";
import { parseIntradayData } from "../../utils/parseIntraday";
import { parseDailyData } from "../../utils/parseDaily";

const { width } = Dimensions.get("window");
type RangeKey = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y";

export default function ChartSection() {
  const [activeRange, setActiveRange] = useState<RangeKey>("1D");
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const tabAnims = useRef(
    (["1D", "1W", "1M", "3M", "6M", "1Y"] as RangeKey[]).map(
      (key) => new Animated.Value(key === "1D" ? 1 : 0)
    )
  ).current;

  const handleRangeChange = (key: RangeKey) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setActiveRange(key);
      (["1D", "1W", "1M", "3M", "6M", "1Y"] as RangeKey[]).forEach((k, i) => {
        Animated.timing(tabAnims[i], {
          toValue: k === key ? 1 : 0,
          duration: 250,
          useNativeDriver: false,
        }).start();
      });
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };


  // Prepare chart data for each range
  const intradayData = parseIntradayData(day["Time Series (5min)"]);
  const weekData = parseDailyData(daily["Time Series (Daily)"], 7);
  const monthData = parseDailyData(daily["Time Series (Daily)"], 30);
  const threeMonthData = parseDailyData(daily["Time Series (Daily)"], 90);
  const sixMonthData = parseDailyData(daily["Time Series (Daily)"], 180);
  const yearData = parseDailyData(daily["Time Series (Daily)"], 365);

  const rangeDataMap = {
    "1D": intradayData,
    "1W": weekData,
    "1M": monthData,
    "3M": threeMonthData,
    "6M": sixMonthData,
    "1Y": yearData,
  };

  const currentData = rangeDataMap[activeRange];
  const chartData = {
    labels: currentData.map(() => ""), // No labels
    datasets: [{ data: currentData.map(d => d.value) }],
  };

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.chartPlaceholder, { opacity: fadeAnim }]}> 
        {currentData && currentData.length > 0 ? (
          <LineChart
            data={chartData}
            width={width + 10}
            height={230}
            chartConfig={{
              backgroundColor: "white",
              backgroundGradientFrom: "white",
              backgroundGradientTo: "white",
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: () => "rgba(0,0,0,0)",
              propsForDots: { r: "1", strokeWidth: "1", stroke: "#007AFF" },
              propsForBackgroundLines: { stroke: "#eee" },
              decimalPlaces: 2,
            }}
            bezier
            style={{
              borderRadius: 12,
              alignSelf: "center",
              marginLeft: 0,
              marginRight: 0,
            }}
            withInnerLines={true}
            withOuterLines={true}
            withVerticalLabels={false}
            withHorizontalLabels={false}
            fromZero={false}
          />
        ) : (
          <Text style={styles.chartHint}>No data for {activeRange}</Text>
        )}
      </Animated.View>

      {/* Range Tabs in One Bar */}
      <View style={styles.rangeTabs}>
        {(["1D", "1W", "1M", "3M", "6M", "1Y"] as RangeKey[]).map((key, i) => {
          const active = activeRange === key;
          const bgColor = tabAnims[i].interpolate({
            inputRange: [0, 1],
            outputRange: ["#f2f2f2", "#007AFF"],
          });
          const textColor = tabAnims[i].interpolate({
            inputRange: [0, 1],
            outputRange: ["black", "#fff"],
          });
          return (
            <Pressable
              key={key}
              onPress={() => handleRangeChange(key)}
              style={{
                flex: 1,
                alignItems: "center",
                borderRadius: 6,
                overflow: "hidden",
                marginHorizontal: 1,
              }}
            >
              <Animated.View style={[styles.tab, { backgroundColor: bgColor }]}>
                <Animated.Text
                  style={[
                    styles.tabText,
                    { color: textColor, fontWeight: active ? "900" : "800" },
                  ]}
                >
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
    borderRadius: 11,
    paddingVertical: 12,
    marginVertical: 12,
    elevation: 2,
    overflow: "hidden",
  },
  chartPlaceholder: {
    // Remove width here so chart can center itself
    height: 220,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 12,
    // borderWidth: 1,
    // borderColor: "red",
    marginRight: 50,
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
    marginLeft: 35,
    marginRight: 35,
    paddingHorizontal: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
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
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "900",
  },
});
