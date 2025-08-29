import React, { useState, useRef, useContext } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { LineChart, LineChartBicolor } from "react-native-gifted-charts";
import { ThemeContext } from "@/theme/ThemeContext";
import { Colors } from "@/constants/Colors";
import { day, daily } from "../../assets/intraday";
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

  const { theme } = useContext(ThemeContext);
  const colorKey: "light" | "dark" = theme === "dark" ? "dark" : "light";
  const themed = Colors[colorKey];

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

  // Convert data for gifted-charts format with better scaling
  const chartData = currentData.map((item) => ({ value: item.value }));

  // Calculate exact min/max from your data for detailed view
  function densifyData(data: { value: number }[], step = 0.1) {
    if (data.length < 2) return data;

    const newData: { value: number }[] = [];

    for (let i = 0; i < data.length - 1; i++) {
      const start = data[i].value;
      const end = data[i + 1].value;

      newData.push({ value: start });

      if (end > start) {
        for (let v = start + step; v < end; v += step) {
          newData.push({ value: v });
        }
      } else if (end < start) {
        for (let v = start - step; v > end; v -= step) {
          newData.push({ value: v });
        }
      }
    }

    // push the last value
    newData.push({ value: data[data.length - 1].value });

    return newData;
  }

  const values = chartData.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  let valueRange = maxValue - minValue;

  const denseChartData = densifyData(chartData, 0.1);

  // If values are too close, enforce a minimum range
  const MIN_RANGE = 10; // 👈 tweak this (try 5, 10, 20 depending on zoom you want)
  if (valueRange < MIN_RANGE) {
    valueRange = MIN_RANGE;
  }

  const padding = valueRange * 0.05; // still add 5% padding
  const yAxisMin = minValue - padding;
  const yAxisMax = minValue + valueRange + padding;

  // Professional color choices
  const chartBg = themed.background;
  const axisColor = themed.icon;
  const textColor = themed.text;
  const positiveColor = theme === "dark" ? "#4FC3F7" : "#007AFF";
  const negativeColor = theme === "dark" ? "#FF5722" : "#FF3B30";
  const pointColor = theme === "dark" ? "#fff" : "#007AFF";
  const tooltipBg = theme === "dark" ? "#222C37" : "#007AFF";
  const tooltipText = theme === "dark" ? "#fff" : "#fff";
  const cardBg = theme === "dark" ? "#1C1C1E" : "#fff";
  const tabBg = theme === "dark" ? "#2C2C2E" : "#f2f2f2";
  const tabActiveBg = theme === "dark" ? "#007AFF" : "#007AFF";
  const tabTextColor = theme === "dark" ? "#fff" : "black";

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <Animated.View
        style={[
          styles.chartPlaceholder,
          { opacity: fadeAnim, backgroundColor: chartBg },
        ]}
      >
        {currentData && currentData.length > 0 ? (
          <LineChart
            yAxisOffset={yAxisMin} // 👈 set min Y value
            maxValue={yAxisMax}
            data={denseChartData}
            width={width - 32}
            height={220}
            isAnimated
            areaChart
            color={positiveColor}
            startFillColor={positiveColor}
            endFillColor={positiveColor}
            startOpacity={0.4}
            endOpacity={0.1}
            thickness={3}
            yAxisColor="transparent"
            xAxisColor={axisColor}
            noOfSections={4}
            yAxisTextStyle={{ color: "transparent" }}
            yAxisLabelWidth={0}
            xAxisLabelTextStyle={{ color: axisColor, fontSize: 10 }}
            initialSpacing={10}
            spacing={
              currentData.length > 1
                ? (width - 60) / (currentData.length - 1)
                : 50
            }
            rulesType="solid"
            rulesColor="transparent"
            showVerticalLines={false}
            showXAxisIndices={false}
            showYAxisIndices={false}
            showFractionalValues={false}
            curved
            curveType={2}
            curvature={0.9}
            thickness={3}
            dataPointsColor={pointColor}
            dataPointsRadius={2}
            dataPointsWidth={1}
            hideDataPoints={false}
            focusEnabled={true}
            showStripOnFocus={true}
            showTextOnFocus={true}
            pointerConfig={{
              showPointerStrip: true,
              pointerStripUptoDataPoint: true,
              pointerStripHeight: 240,
              pointerStripWidth: 2,
              pointerColor: positiveColor,
              pointerStripColor: theme === "dark" ? "#ffffff60" : "#00000040",
              strokeDashArray: [4, 4],
              autoAdjustPointerLabelPosition: true,
              pointerLabelComponent: (items: any) => {
                // Handle different data structures that gifted-charts might pass
                let value = 0;
                if (Array.isArray(items) && items.length > 0) {
                  value = items[0].value;
                } else if (items && typeof items.value === "number") {
                  value = items.value;
                } else if (typeof items === "number") {
                  value = items;
                }

                return (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 15,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: tooltipBg,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor:
                          theme === "dark" ? "#ffffff20" : "#00000015",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 6,
                        elevation: 8,
                        minWidth: 60,
                      }}
                    >
                      <Text
                        style={{
                          color: tooltipText,
                          fontWeight: "bold",
                          fontSize: 16,
                          textAlign: "center",
                        }}
                      >
                        ${value.toFixed(2)}
                      </Text>
                    </View>
                    {/* Triangle pointer */}
                    <View
                      style={{
                        width: 0,
                        height: 0,
                        borderLeftWidth: 10,
                        borderRightWidth: 10,
                        borderTopWidth: 12,
                        borderStyle: "solid",
                        backgroundColor: "transparent",
                        borderLeftColor: "transparent",
                        borderRightColor: "transparent",
                        borderTopColor: tooltipBg,
                        marginTop: -1,
                      }}
                    />
                  </View>
                );
              },
            }}
          />
        ) : (
          <Text style={[styles.chartHint, { color: textColor }]}>
            No data for {activeRange}
          </Text>
        )}
      </Animated.View>

      {/* Range Tabs in One Bar */}
      <View style={[styles.rangeTabs, { backgroundColor: tabBg }]}>
        {(["1D", "1W", "1M", "3M", "6M", "1Y"] as RangeKey[]).map((key, i) => {
          const active = activeRange === key;
          const bgColor = tabAnims[i].interpolate({
            inputRange: [0, 1],
            outputRange: [tabBg, tabActiveBg],
          });
          const textColor = tabAnims[i].interpolate({
            inputRange: [0, 1],
            outputRange: [tabTextColor, "#fff"],
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
    borderRadius: 11,
    paddingVertical: 12,
    marginVertical: 12,
    elevation: 2,
    overflow: "hidden",
  },
  chartPlaceholder: {
    height: 240,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    marginHorizontal: 16,
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
    fontWeight: "bold",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "900",
  },
});
