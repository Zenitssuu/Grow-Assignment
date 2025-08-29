import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
// import { useGetTopGainerLoserList } from "@/hooks/stocks.hook";
import { IconSymbol } from "../components/ui/IconSymbol";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "@/theme/ThemeContext";
import { Colors } from "@/constants/Colors";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type StockItem = {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
};
type Company = {
  id: string;
  name: string;
  logo: string;
  price: string;
};

type TopStocksScreenRouteParams = {
  title?: string;
};

const PAGE_SIZE = 10;

const TopStocksScreen = () => {
  // console.log("here");
  const stockList = useSelector((state: RootState) => state.stockList);

  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const colorKey: "light" | "dark" = theme === "dark" ? "dark" : "light";
  const themed = Colors[colorKey];
  const route =
    useRoute<RouteProp<Record<string, TopStocksScreenRouteParams>, string>>();
  const title = route.params?.title || "Top Gainers";
  const isGainers = title !== "Top Losers";

  const [page, setPage] = useState(1);
  const [data, setData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // console.log(data.length);

  // Use paginated hook
  // const { stockData, isLoading, isError, isSuccess } = useGetTopGainerLoserList(
  //   page,
  //   PAGE_SIZE
  // );

  // console.log(stockData)

  // Append new data when stockData changes
  useEffect(() => {
    // if (isSuccess && stockData) {
    //   // const newItems = isGainers ? stockData.top_gainers : stockData.top_losers;
    //   const newItems = isGainers ? TOP_GAINERS_DATA : TOP_LOSERS_DATA;

    //   if (page === 1) {
    //     setData(newItems);
    //   } else {
    //     setData((prev) => [...prev, ...newItems]);
    //   }
    //   setShowEmpty(newItems.length === 0 && page === 1);
    // }

    if (stockList) {
      const newItems = isGainers ? stockList.top_gainers : stockList.top_losers;

      if (page === 1) {
        setData(newItems);
      } else {
        setData((prev) => [...prev, ...newItems]);
      }
      setShowEmpty(newItems.length === 0 && page === 1);
    }
  }, [page, isGainers]);

  // // Error and loading handling
  // useEffect(() => {
  //   setLoading(isLoading);
  //   setError(isError);
  // }, [isLoading, isError]);

  const handleRetry = () => {
    setError(false);
    setLoading(false);
    setPage(1);
  };

  const handleCardPress = (stock: StockItem) => {
    // @ts-ignore
    navigation.navigate("StockDetails", { ...stock });
  };

  const renderItem = ({ item }: { item: StockItem }) => {
    const isPositive = item?.change_amount[0] !== "-";
    return (
      <TouchableOpacity
        onPress={() => handleCardPress(item)}
        style={[
          styles.card,
          { backgroundColor: themed.background, shadowColor: themed.text },
        ]}
        activeOpacity={0.8}
      >
        <View style={styles.leftCol}>
          <Text style={[styles.symbol, { color: themed.text }]}>
            {item.ticker}
          </Text>
        </View>
        <View style={styles.rightCol}>
          <Text style={[styles.price, { color: themed.text }]}>
            ${item.price}
          </Text>
          <View style={styles.changeRow}>
            <IconSymbol
              name={isPositive ? "chevron.right" : "chevron.right"}
              size={14}
              color={
                isPositive
                  ? theme === "dark"
                    ? "#4caf50"
                    : "#388e3c"
                  : theme === "dark"
                  ? "#ff5252"
                  : "#d32f2f"
              }
              style={{
                transform: [{ rotate: isPositive ? "-90deg" : "90deg" }],
              }}
            />
            <Text
              style={[
                styles.change,
                {
                  color: isPositive
                    ? theme === "dark"
                      ? "#4caf50"
                      : "#388e3c"
                    : theme === "dark"
                    ? "#ff5252"
                    : "#d32f2f",
                },
              ]}
            >
              {item.change_percentage}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Loading state
  if (loading && page === 1) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { paddingTop: 30, backgroundColor: themed.background },
        ]}
      >
        {[...Array(4)].map((_, i) => (
          <View
            key={i}
            style={[styles.skeletonCard, { backgroundColor: themed.icon }]}
          />
        ))}
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: themed.background }]}
      >
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: themed.icon }]}>
            Something went wrong.
          </Text>
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: themed.tint }]}
            onPress={handleRetry}
          >
            <Text style={[styles.retryText, { color: themed.background }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  // console.log(data.length);

  // Empty state
  if (showEmpty || data.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: themed.background }]}
      >
        <View style={styles.centered}>
          <IconSymbol name="magnifyingglass" size={48} color={themed.icon} />
          <Text style={[styles.emptyText, { color: themed.icon }]}>
            No stocks available in this list
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Infinite scroll handler
  // const handleEndReached = () => {
  //   if (!loading && stockData) {
  //     const total = isGainers
  //       ? stockData.total_gainers
  //       : stockData.total_losers;
  //     if (data.length < total) {
  //       setPage((prev) => prev + 1);
  //     }
  //   }
  // };

  return (
    <>
      {/* <SafeAreaView style={styles.safeHeaderArea}>
        <View style={styles.customHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBtn}
          >
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.PageTitle}>{title}</Text>
          <View style={{ flex: 1 }} />
        </View>
      </SafeAreaView> */}
      <SafeAreaView
        style={[styles.container, { backgroundColor: themed.background }]}
      >
        <View
          style={[
            styles.safeHeaderArea,
            { backgroundColor: themed.background },
          ]}
        >
          <View
            style={[
              styles.customHeader,
              {
                backgroundColor: themed.background,
                borderBottomColor: themed.icon,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => navigation.goBack()}
            >
              <IconSymbol
                name="chevron.right"
                size={24}
                color={themed.text}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: themed.text }]}>
              {title}
            </Text>
            <View style={{ width: 32 }} />
          </View>
        </View>

        <View style={styles.columnHeaderRow}>
          <Text style={[styles.columnHeaderLeft, { color: themed.icon }]}>
            Company
          </Text>
          <Text style={[styles.columnHeaderRight, { color: themed.icon }]}>
            Market Price
          </Text>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.ticker}
          contentContainerStyle={{ paddingBottom: 24 }}
          ItemSeparatorComponent={() => (
            <View style={[styles.divider, { backgroundColor: themed.icon }]} />
          )}
          // onEndReached={() => {
          //   if (hasScrolled) handleEndReached();
          // }}
          // onScroll={() => {
          //   if (!hasScrolled) setHasScrolled(true);
          // }}
          // onEndReachedThreshold={0.5}
          // ListFooterComponent={
          //   loading && page > 1 ? (
          //     <View
          //       style={[styles.skeletonCard, { backgroundColor: themed.icon }]}
          //     />
          //   ) : null
          // }
        />
      </SafeAreaView>
    </>
  );
};

const COLORS = {
  bg: "#fff",
  text: "#111827",
  subtle: "#6B7280",
  border: "#E5E7EB",
  pillBg: "#F3F4F6",
  priceUp: "#16A34A",
  priceDown: "#ff0000ff",
  cardBg: "#FFFFFF",
  shadow: "rgba(0,0,0,0.05)",
};

const styles = StyleSheet.create({
  safeHeaderArea: {
    backgroundColor: "#fff",
  },
  PageTitle: {
    fontSize: 18,
    // fontWeight: "regular",
  },
  content: { padding: 16, paddingBottom: 32 },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    elevation: 2,
    zIndex: 10,
  },
  headerBtn: {
    padding: 6,
    borderRadius: 20,
  },
  columnHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 2,
  },
  columnHeaderLeft: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
    flex: 1,
  },
  columnHeaderRight: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
    minWidth: 90,
    textAlign: "right",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    flex: 1,
    textAlign: "center",
  },
  searchBtn: {
    padding: 4,
    marginLeft: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    justifyContent: "space-between",
  },
  leftCol: {
    flex: 1,
  },
  symbol: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  company: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  rightCol: {
    alignItems: "flex-end",
    minWidth: 90,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  change: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  positive: {
    color: "#388e3c",
  },
  negative: {
    color: "#d32f2f",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 24,
  },
  loadMoreBtn: {
    margin: 20,
    backgroundColor: "#1976d2",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 10,
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    marginTop: 16,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 16,
    marginBottom: 12,
  },
  retryBtn: {
    backgroundColor: "#1976d2",
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  skeletonCard: {
    height: 64,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 14,
  },
});

export default TopStocksScreen;
