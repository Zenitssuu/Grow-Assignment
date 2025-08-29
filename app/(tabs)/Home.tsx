import { View, Text } from "react-native";
import React from "react";
import HomeScreen from "@/components/custom/HomeScreen";
import { useGetTopGainerLoser } from "@/hooks/stocks.hook";
import { useDispatch } from "react-redux";
import { setList } from "@/store/topList";

const Home = () => {
  const dispatch = useDispatch();
  const { stockData, isLoading, isError, error, isSuccess } =
    useGetTopGainerLoser();

  if (isLoading) {
    // Skeleton loader for HomeScreen
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          padding: 16,
          paddingTop: 40,
        }}
      >
        {/* Header skeleton */}
        <View
          style={{
            height: 40,
            backgroundColor: "#ececec",
            borderRadius: 8,
            marginBottom: 16,
          }}
        />
        {/* Top Gainers skeleton */}
        <View
          style={{
            height: 28,
            width: 120,
            backgroundColor: "#ececec",
            borderRadius: 6,
            marginBottom: 12,
          }}
        />
        <View style={{ flexDirection: "row", marginBottom: 24 }}>
          {[...Array(2)].map((_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 120,
                backgroundColor: "#ececec",
                borderRadius: 12,
                marginRight: i === 0 ? 12 : 0,
              }}
            />
          ))}
        </View>
        {/* Top Losers skeleton */}
        <View
          style={{
            height: 28,
            width: 120,
            backgroundColor: "#ececec",
            borderRadius: 6,
            marginBottom: 12,
          }}
        />
        <View style={{ flexDirection: "row" }}>
          {[...Array(2)].map((_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 120,
                backgroundColor: "#ececec",
                borderRadius: 12,
                marginRight: i === 0 ? 12 : 0,
              }}
            />
          ))}
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          paddingTop: 40,
        }}
      >
        {/* Error Icon */}
        <View
          style={{
            backgroundColor: "#ffeaea",
            borderRadius: 40,
            padding: 18,
            marginBottom: 18,
          }}
        >
          <Text style={{ fontSize: 36, color: "#d32f2f" }}>!</Text>
        </View>
        <Text
          style={{
            color: "#d32f2f",
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 8,
          }}
        >
          Oops! Something went wrong
        </Text>
        <Text
          style={{
            color: "#888",
            fontSize: 15,
            textAlign: "center",
            marginBottom: 18,
          }}
        >
          {error?.message || "An unexpected error occurred."}
        </Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#888", fontSize: 13, textAlign: "center" }}>
              Please check your connection and try again.
            </Text>
          </View>
        </View>
        <View style={{ height: 24 }} />
        <View style={{ width: 160 }}>
          <View style={{ borderRadius: 8, overflow: "hidden" }}>
            <Text
              onPress={() => {
                if (typeof globalThis?.location?.reload === "function") {
                  globalThis.location.reload();
                }
              }}
              style={{
                backgroundColor: "#1976d2",
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
                paddingVertical: 10,
              }}
            >
              Retry
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const { top_gainers, top_losers } = stockData;

  if (isSuccess) {
    dispatch(setList({ top_losers, top_gainers }));
  }

  return <HomeScreen />;
};

export default Home;
