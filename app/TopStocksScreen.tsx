import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { IconSymbol } from "../components/ui/IconSymbol";

type StockItem = {
  symbol: string;
  name: string;
  price: string;
  change: string;
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

const DUMMY_DATA_GAINERS: StockItem[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: "145.30",
    change: "+2.15 (+1.5%)",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: "720.50",
    change: "+15.30 (+2.1%)",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: "2725.60",
    change: "+30.10 (+1.1%)",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: "299.10",
    change: "+5.20 (+1.8%)",
  },
];
const DUMMY_DATA_LOSERS: StockItem[] = [
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
    price: "510.20",
    change: "-12.50 (-2.4%)",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: "3342.88",
    change: "-22.10 (-0.7%)",
  },
];

const TopStocksScreen = () => {
  const navigation = useNavigation();
  const route =
    useRoute<RouteProp<Record<string, TopStocksScreenRouteParams>, string>>();
  const title = route.params?.title || "Top Gainers";
  const isGainers = title !== "Top Losers";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState<StockItem[]>(
    isGainers ? DUMMY_DATA_GAINERS : DUMMY_DATA_LOSERS
  );
  const [showEmpty, setShowEmpty] = useState(false);

  const handleLoadMore = () => {
    // Dummy: just set empty for demo
    setShowEmpty(true);
    setData([]);
  };

  const handleRetry = () => {
    setError(false);
    setLoading(false);
    setData(isGainers ? DUMMY_DATA_GAINERS : DUMMY_DATA_LOSERS);
  };

  const handleCardPress = (stock: StockItem) => {
    // @ts-ignore
    navigation.navigate("StockDetails", { ...stock });
  };

  const renderItem = ({ item }: { item: StockItem }) => {
    const isPositive = item.change.trim().startsWith("+");
    return (
      <TouchableOpacity
        onPress={() => handleCardPress(item)}
        style={styles.card}
        activeOpacity={0.8}
      >
        <View style={styles.leftCol}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.company}>{item.name}</Text>
        </View>
        <View style={styles.rightCol}>
          <Text style={styles.price}>${item.price}</Text>
          <View style={styles.changeRow}>
            <IconSymbol
              name={isPositive ? "chevron.right" : "chevron.right"}
              size={14}
              color={isPositive ? "#388e3c" : "#d32f2f"}
              style={{
                transform: [{ rotate: isPositive ? "-90deg" : "90deg" }],
              }}
            />
            <Text
              style={[
                styles.change,
                isPositive ? styles.positive : styles.negative,
              ]}
            >
              {item.change}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {[...Array(4)].map((_, i) => (
          <View key={i} style={styles.skeletonCard} />
        ))}
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Something went wrong.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Empty state
  if (showEmpty || data.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <IconSymbol name="magnifyingglass" size={48} color="#bbb" />
          <Text style={styles.emptyText}>No stocks available in this list</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.columnHeaderRow}>
        <Text style={styles.columnHeaderLeft}>Company</Text>
        <Text style={styles.columnHeaderRight}>Market Price</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.symbol}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
      <TouchableOpacity style={styles.loadMoreBtn} onPress={handleLoadMore}>
        <Text style={styles.loadMoreText}>Load More</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
