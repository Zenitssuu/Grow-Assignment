// src/screens/DetailsScreen.tsx
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IconSymbol } from "../ui/IconSymbol";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { addStock, addWatchList, removeStock } from "@/store/watchListSlice";
import { useGetStockDetails } from "@/hooks/stocks.hook";
import SkeletonLoader from "./SkeletonLoader";
import { Image } from "expo-image";
import { ThemeContext } from "@/theme/ThemeContext";
import { Colors } from "@/constants/Colors";
import TemporaryChart from "./temporaryChart";

type RangeKey = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y";

export type Company = {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
};

type RootStackParamList = {
  StockDetails: Company;
};

type StockDetailsRouteProp = RouteProp<RootStackParamList, "StockDetails">;

export default function DetailsScreen() {
  const { theme } = useContext(ThemeContext);
  const colorKey: "light" | "dark" = theme === "dark" ? "dark" : "light";
  const themed = Colors[colorKey];
  const route = useRoute<StockDetailsRouteProp>();
  const company = route.params;
  const dispatch = useDispatch();
  const watchlists = useSelector(
    (state: RootState) => state.watchList.watchlists
  );

  let { companyData, isLoading, isError, isSuccess, error } =
    useGetStockDetails(company.ticker);

  // companyData = sampleStockDetails || {};
  // console.log(companyData);

  let companyLogoName = companyData?.OfficialSite?.split("https://")[1];

  const [activeRange, setActiveRange] = useState<RangeKey>("1D");
  const [saved, setSaved] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedWatchlist, setSelectedWatchlist] = useState<string>("");
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const navigation = useNavigation();

  // Check if stock is already saved in any watchlist
  useEffect(() => {
    if (!companyData?.Symbol || !Array.isArray(watchlists)) {
      setSaved(false);
      return;
    }
    const isSaved = watchlists.some((wl) =>
      wl.stocks?.some((stock) => stock.ticker === companyData.Symbol)
    );
    setSaved(isSaved);
  }, [watchlists, companyData?.Symbol]);

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: themed.background, paddingTop: 40 }}
      >
        <SkeletonLoader />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView
        style={{ marginTop: 20, backgroundColor: themed.background }}
      >
        <Text style={{ color: themed.text }}>
          Error {error?.message}!! please wait.
        </Text>
      </SafeAreaView>
    );
  }

  const weekLow = parseFloat(companyData["52WeekLow"] || "0");
  const weekHigh = parseFloat(companyData["52WeekHigh"] || "0");
  const currentPrice = parseFloat(company.price || "0");

  const position =
    weekHigh !== weekLow
      ? ((currentPrice - weekLow) / (weekHigh - weekLow)) * 100
      : 0;

  // Add to Watchlist logic
  const handleAddStock = () => {
    let targetWatchlist = selectedWatchlist;
    if (
      !targetWatchlist &&
      typeof newWatchlistName === "string" &&
      newWatchlistName.trim()
    ) {
      dispatch(addWatchList(newWatchlistName.trim()));
      targetWatchlist = newWatchlistName.trim();
    }
    if (targetWatchlist) {
      dispatch(
        addStock({
          watchlistName: targetWatchlist,
          stock: {
            ticker: companyData.Symbol,
            price: company.price,
            change_price: company.change_amount,
            change_percentage: company.change_percentage,
          },
        })
      );
      setSaved(true); // Only mark as saved after adding
      setShowAddModal(false);
      setSelectedWatchlist("");
      setNewWatchlistName("");
    }
  };

  const handleRemoveStock = () => {
    // Find the first watchlist containing this stock
    const wl = watchlists.find((wl) =>
      wl.stocks?.some((stock) => stock.ticker === companyData.Symbol)
    );
    if (wl) {
      dispatch(
        removeStock({
          watchlistName: wl.name,
          ticker: companyData.Symbol,
        })
      );
      setSaved(false);
    }
  };

  const companyDescription = (company: string) => {
    return `We are a ${company}, dedicated to delivering innovative solutions that drive growth and efficiency. Our team is passionate about excellence, committed to client success, and focused on creating value through reliable services and forward-thinking strategies across industries.`;
  };

  // console.log(companyData.Description);

  return (
    <>
      {/* Custom Header */}
      <SafeAreaView
        style={[styles.safeHeaderArea, { backgroundColor: themed.background }]}
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
            onPress={() => navigation.goBack()}
            style={styles.headerBtn}
          >
            <Ionicons name="arrow-back" size={24} color={themed.text} />
          </TouchableOpacity>
          <Text style={[styles.PageTitle, { color: themed.text }]}>
            Stock Details
          </Text>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={() => {
              if (saved) {
                handleRemoveStock();
              } else {
                setShowAddModal(true);
              }
            }}
            style={styles.headerBtn}
          >
            <IconSymbol
              name={saved ? "bookmark.fill" : "bookmark"}
              size={22}
              color={saved ? themed.tint : themed.icon}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <ScrollView
        style={[styles.container, { backgroundColor: themed.background }]}
        contentContainerStyle={styles.content}
      >
        {/* Company Card */}
        <View
          style={[styles.companyRow, { backgroundColor: themed.background }]}
        >
          <View
            style={[
              styles.logoWrap,
              { borderColor: themed.icon, backgroundColor: themed.background },
            ]}
          >
            <Image
              source={`https://logo.clearbit.com/${companyLogoName}`}
              style={styles.logo}
              contentFit="cover"
              transition={300}
              cachePolicy="memory-disk"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.companyName, { color: themed.text }]}>
              {companyData.Name}
            </Text>
            <Text style={[styles.subtle, { color: themed.icon }]}>
              {companyData.Symbol}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={[styles.price, { color: themed.text }]}>
              ${company.price}
            </Text>
            <View style={styles.changeRow}>
              {company.change_amount[0] === "-" ? (
                <>
                  <Text
                    style={[
                      styles.changeText,
                      { color: colorKey === "dark" ? "#ff5252" : "#ff0000ff" },
                    ]}
                  >
                    {company.change_amount}
                  </Text>
                  <Ionicons
                    name="caret-down"
                    size={14}
                    color={colorKey === "dark" ? "#ff5252" : "#ff0000ff"}
                  />
                </>
              ) : (
                <>
                  <Text
                    style={[
                      styles.changeText,
                      { color: colorKey === "dark" ? "#4caf50" : "#16A34A" },
                    ]}
                  >
                    +{company.change_amount}
                  </Text>
                  <Ionicons
                    name="caret-up"
                    size={14}
                    color={colorKey === "dark" ? "#4caf50" : "#16A34A"}
                  />
                </>
              )}
            </View>
          </View>
        </View>
        {/* Add to Watchlist Button */}
        {/* <TouchableOpacity
          style={{
            backgroundColor: "#1976d2",
            borderRadius: 20,
            alignItems: "center",
            paddingVertical: 10,
            marginBottom: 16,
          }}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>
            Add to Watchlist
          </Text>
        </TouchableOpacity> */}
        {/* Chart Card (placeholder for now) */}
        {/* <ChartSection /> */}
        <TemporaryChart />
        {/* About section header (content comes next piece) */}
        {/* About Section Card */}
        {/* Company Details Section */}
        <View
          style={[
            styles.detailsCard,
            {
              backgroundColor: themed.background,
              borderColor: themed.borderColor,
            },
          ]}
        >
          {/* About Section Title */}
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: themed.icon + "22", // 13% opacity for subtle border
              marginBottom: 10,
              paddingBottom: 6,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: themed.text,
                letterSpacing: 0.5,
              }}
            >
              About
            </Text>
          </View>
          {/* About */}
          <Text style={[styles.aboutText, { color: themed.text }]}>
            {companyData.Description !== "None"
              ? companyData.Description
              : companyDescription(companyData.Name)}
          </Text>
          {/* Tags */}
          <View style={styles.tagRow}>
            <View
              style={[
                styles.tag,
                {
                  backgroundColor: themed.background,
                  borderColor: themed.icon,
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.tagText, { color: themed.text }]}>
                Industry: {companyData.Industry}
              </Text>
            </View>
            <View
              style={[
                styles.tag,
                {
                  backgroundColor: themed.background,
                  borderColor: themed.icon,
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.tagText, { color: themed.text }]}>
                Sector: {companyData.Sector}
              </Text>
            </View>
          </View>
          {/* Divider */}
          <View
            style={[styles.sectionDivider, { backgroundColor: themed.icon }]}
          />
          {/* 52-Week Range */}
          <View style={styles.rangeHeader}>
            <Text style={[styles.sectionTitle, { color: themed.text }]}>
              52 Week Range
            </Text>
          </View>
          <View style={styles.rangeLabels}>
            <Text style={[styles.rangeLabel, { color: themed.icon }]}>
              Low ${companyData["52WeekLow"]}
            </Text>
            <Text style={[styles.rangeLabel, { color: themed.icon }]}>
              High ${companyData["52WeekHigh"]}
            </Text>
          </View>
          <View style={styles.sliderWrap}>
            <View
              style={[styles.sliderTrack, { backgroundColor: themed.icon }]}
            />
            <View
              style={[
                styles.triangle,
                { left: `${position}%`, position: "absolute" },
              ]}
            >
              <IconSymbol name="triangle" size={18} color={themed.text} />
            </View>
          </View>
          {/* Divider */}
          <View
            style={[styles.sectionDivider, { backgroundColor: themed.icon }]}
          />
          {/* Metrics Row */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricLabel, { color: themed.icon }]}>
                Mkt Cap
              </Text>
              <Text style={[styles.metricValue, { color: themed.text }]}>
                $2.7T
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricLabel, { color: themed.icon }]}>
                P/E
              </Text>
              <Text style={[styles.metricValue, { color: themed.text }]}>
                28.3
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricLabel, { color: themed.icon }]}>
                Beta
              </Text>
              <Text style={[styles.metricValue, { color: themed.text }]}>
                1.25
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricLabel, { color: themed.icon }]}>
                Div Yield
              </Text>
              <Text style={[styles.metricValue, { color: themed.text }]}>
                0.55%
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricLabel, { color: themed.icon }]}>
                Profit
              </Text>
              <Text style={[styles.metricValue, { color: themed.text }]}>
                22.4%
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Add to Watchlist Modal */}
      {showAddModal && (
        <AddToWatchlistModal
          visible={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setSelectedWatchlist("");
            setNewWatchlistName("");
          }}
          watchlists={watchlists}
          selectedWatchlist={selectedWatchlist}
          setSelectedWatchlist={setSelectedWatchlist}
          newWatchlistName={newWatchlistName}
          setNewWatchlistName={setNewWatchlistName}
          onAdd={handleAddStock}
          themed={themed}
        />
      )}
    </>
  );
}

// Modal component for selecting/creating watchlist
function AddToWatchlistModal({
  visible,
  onClose,
  watchlists,
  selectedWatchlist,
  setSelectedWatchlist,
  newWatchlistName,
  setNewWatchlistName,
  onAdd,
  themed,
}: any) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.18)",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: themed.background,
            borderRadius: 16,
            padding: 24,
            width: 320,
            maxWidth: "90%",
            alignItems: "center",
            shadowColor: themed.text,
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 4,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: themed.text,
              marginBottom: 16,
            }}
          >
            Add to Watchlist
          </Text>
          <ScrollView style={{ maxHeight: 180, width: "100%" }}>
            {watchlists.map((wl: any) => (
              <TouchableOpacity
                key={wl.name}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor:
                    selectedWatchlist === wl.name
                      ? themed.tint
                      : themed.background, // Use background for unselected
                  borderWidth: 1,
                  borderColor: themed.icon,
                  marginBottom: 8,
                }}
                onPress={() => {
                  setSelectedWatchlist(wl.name);
                  setNewWatchlistName("");
                }}
              >
                <Text
                  style={{
                    color:
                      selectedWatchlist === wl.name
                        ? themed.background
                        : themed.text, // Use text for unselected
                    fontWeight: "bold",
                  }}
                >
                  {wl.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={{ marginVertical: 10, color: themed.icon }}>
            Or create new watchlist
          </Text>
          <TextInput
            style={{
              width: "100%",
              borderWidth: 1,
              borderColor: themed.icon,
              borderRadius: 8,
              padding: 10,
              fontSize: 15,
              marginBottom: 18,
              color: themed.text,
              backgroundColor: themed.background, // Use background for input
            }}
            placeholder="New Watchlist Name"
            placeholderTextColor={themed.icon}
            value={newWatchlistName}
            onChangeText={(text: string) => {
              setNewWatchlistName(text);
              setSelectedWatchlist("");
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: "center",
                backgroundColor: themed.background,
                marginHorizontal: 4,
                borderWidth: 1,
                borderColor: themed.icon,
              }}
              onPress={onClose}
            >
              <Text
                style={{ color: themed.text, fontWeight: "bold", fontSize: 15 }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: "center",
                backgroundColor: themed.tint,
                marginHorizontal: 4,
              }}
              onPress={onAdd}
            >
              <Text
                style={{
                  color: themed.background,
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

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
  container: { flex: 1, backgroundColor: COLORS.bg },
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

  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  logoWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    overflow: "hidden",
  },
  logo: {
    width: "100%",
    height: "100%",
    // backgroundColor: "#e0e0e0",
  },
  companyName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtle: {
    fontSize: 12,
    color: COLORS.subtle,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    // color: COLORS.priceUp,
    fontWeight: "600",
  },

  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  chartHint: { color: COLORS.subtle, fontSize: 12 },
  rangeTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  tabActive: {
    backgroundColor: "#000", // active highlight
  },
  tabText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "500",
  },

  tabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: COLORS.text,
  },
  aboutCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.subtle,
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.pillBg,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },
  rangeHeader: {
    marginBottom: 8,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  rangeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.subtle,
  },
  sliderWrap: {
    height: 26,
    position: "relative",
    justifyContent: "center",
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.pillBg,
  },
  triangle: {
    position: "absolute",
    top: 10, // below the bar
    color: "#111827",
  },

  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.subtle,
    marginBottom: 4,
    fontWeight: "500",
  },
  metricValue: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },
  divider: {
    width: 1,
    height: "70%",
    backgroundColor: COLORS.border,
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    // marginBottom: 24,
  },
});
