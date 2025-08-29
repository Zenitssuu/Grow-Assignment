import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { IconSymbol } from "../components/ui/IconSymbol";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { addWatchList } from "@/store/watchListSlice";
import { ThemeContext } from "@/theme/ThemeContext";
import { Colors } from "@/constants/Colors";

type Company = {
  id: string;
  name: string;
  logo: string;
  price: string;
};

type RootStackParamList = {
  TopStocksScreen: { title: string };
  StockDetails: Company;
};

const WatchlistScreen = () => {
  const { theme } = useContext(ThemeContext);
  const colorKey: "light" | "dark" = theme === "dark" ? "dark" : "light";
  const themed = Colors[colorKey];
  const dispatch = useDispatch();
  const watchlists = useSelector(
    (state: RootState) => state.watchList.watchlists
  );
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const stocks = watchlists[activeTab]?.stocks || [];

  // Loading state
  if (loading) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: themed.background }]}
      >
        <Header onAdd={() => setShowModal(true)} themed={themed} />
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
        style={[styles.safeArea, { backgroundColor: themed.background }]}
      >
        <Header onAdd={() => setShowModal(true)} themed={themed} />
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: themed.icon }]}>
            Couldn't load watchlist
          </Text>
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: themed.tint }]}
            onPress={() => setError(false)}
          >
            <Text style={[styles.retryText, { color: themed.background }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleCreateWatchlist = () => {
    if (typeof newListName === "string" && newListName?.trim()) {
      dispatch(addWatchList(newListName?.trim()));
      setShowModal(false);
      setNewListName("");
      setActiveTab(watchlists.length); // Switch to the new tab
    }
  };

  // console.log(watchlists);

  // No watchlists
  if (!watchlists.length) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: themed.background }]}
      >
        <Header onAdd={() => setShowModal(true)} themed={themed} />
        <View style={styles.centered}>
          <IconSymbol name="bookmark.fill" size={48} color={themed.icon} />
          <Text style={[styles.emptyText, { color: themed.icon }]}>
            No watchlists yet
          </Text>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: themed.tint }]}
            onPress={() => setShowModal(true)}
          >
            <Text style={[styles.addBtnText, { color: themed.background }]}>
              Create New Watchlist
            </Text>
          </TouchableOpacity>
        </View>
        <AddModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          newListName={newListName}
          setNewListName={setNewListName}
          onCreate={handleCreateWatchlist}
          themed={themed}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: themed.background }]}
    >
      <Header onAdd={() => setShowModal(true)} themed={themed} />
      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsRow}
      >
        {watchlists?.map((wl, idx) => {
          return (
            <TouchableOpacity
              key={wl.name}
              style={[
                styles.tab,
                { backgroundColor: themed.icon },
                idx === activeTab && { backgroundColor: themed.tint },
              ]}
              onPress={() => setActiveTab(idx)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: themed.text },
                  idx === activeTab && {
                    color: themed.background,
                    fontWeight: "bold",
                  },
                ]}
              >
                {wl.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {/* Empty state for selected watchlist */}
      {stocks.length === 0 ? (
        <View style={styles.centered}>
          <IconSymbol name="magnifyingglass" size={48} color={themed.icon} />
          <Text style={[styles.emptyText, { color: themed.icon }]}>
            No stocks in this watchlist
          </Text>
        </View>
      ) : (
        <FlatList
          data={stocks}
          renderItem={({ item }) => <StockRow item={item} themed={themed} />}
          keyExtractor={(item, index) => item?.Symbol || index.toString()}
          contentContainerStyle={{ paddingBottom: 24 }}
          ItemSeparatorComponent={() => (
            <View style={[styles.divider, { backgroundColor: themed.icon }]} />
          )}
        />
      )}
      {/* Add Modal */}
      <AddModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        newListName={newListName}
        setNewListName={setNewListName}
        onCreate={handleCreateWatchlist}
        themed={themed}
      />
    </SafeAreaView>
  );
};

const Header = ({ onAdd, themed }: { onAdd: () => void; themed: any }) => (
  <View style={[styles.headerRow, { backgroundColor: themed.background }]}>
    <Text style={[styles.headerTitle, { color: themed.text }]}>Watchlist</Text>
    <TouchableOpacity style={styles.headerAddBtn} onPress={onAdd}>
      <IconSymbol name="plus" size={24} color={themed.tint} />
    </TouchableOpacity>
  </View>
);

const StockRow = ({ item, themed }: { item: any; themed: any }) => {
  console.log("item here", item);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // Support both possible property names for compatibility
  const symbol = item.symbol || item.ticker || "";
  const company = item.name || item.company || symbol;
  const price = item.price || "-";
  const change = item.change_percentage || item.change || "";
  const logo = item.logo || item.image || "";
  const id = item.id || symbol;
  // Extract numeric value for color logic
  let changeValue = 0;
  if (typeof change === "string") {
    // Try to extract the first number (handles both "+2.15 (+1.5%)" and "-15.30 (-2.1%)")
    const match = change.match(/[-+]?\d*\.?\d+/);
    if (match) changeValue = parseFloat(match[0]);
  } else if (typeof change === "number") {
    changeValue = change;
  }
  const isPositive = changeValue > 0;
  return (
    <TouchableOpacity
      onPress={() => {
        // Map to expected Company shape for StockDetailsScreen
        navigation.navigate("StockDetails", {
          ticker: symbol,
          price: price.toString(),
          change_amount: typeof change === "string" ? change.split(" ")[0] : "",
          change_percentage:
            typeof change === "string" && change.includes("(")
              ? change.split("(")[1].replace(")", "")
              : "",
          volume: "", // Not available in watchlist, pass empty string
        });
      }}
      style={[
        styles.card,
        { backgroundColor: themed.background, shadowColor: themed.text },
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.leftCol}>
        <Text style={[styles.symbol, { color: themed.text }]}>{symbol}</Text>
        <Text style={[styles.company, { color: themed.icon }]}>{company}</Text>
      </View>
      <View style={styles.rightCol}>
        <Text style={[styles.price, { color: themed.text }]}>${price}</Text>
        <View style={styles.changeRow}>
          <IconSymbol
            name={isPositive ? "chevron.right" : "chevron.right"}
            size={14}
            color={
              isPositive
                ? themed === "dark"
                  ? "#4caf50"
                  : "#388e3c"
                : themed === "dark"
                ? "#ff5252"
                : "#d32f2f"
            }
            style={{ transform: [{ rotate: isPositive ? "-90deg" : "90deg" }] }}
          />
          <Text
            style={[
              styles.change,
              {
                color: isPositive
                  ? themed === "dark"
                    ? "#4caf50"
                    : "#388e3c"
                  : themed === "dark"
                  ? "#ff5252"
                  : "#d32f2f",
              },
            ]}
          >
            {change}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AddModal = ({
  visible,
  onClose,
  newListName,
  setNewListName,
  onCreate,
  themed,
}: any) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View
        style={[
          styles.modalBox,
          { backgroundColor: themed.background, shadowColor: themed.text },
        ]}
      >
        <Text style={[styles.modalTitle, { color: themed.text }]}>
          Create New Watchlist
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: themed.text,
              backgroundColor: themed.background,
              borderColor: themed.icon,
            },
          ]}
          placeholder="Watchlist Name"
          placeholderTextColor={themed.icon}
          value={newListName}
          onChangeText={setNewListName}
        />
        <View style={styles.modalBtnRow}>
          <TouchableOpacity
            style={[
              styles.modalBtn,
              {
                backgroundColor:
                  themed === "dark" ? themed.icon : themed.background,
                borderWidth: 1,
                borderColor: themed.icon,
              },
            ]}
            onPress={onClose}
          >
            <Text
              style={[
                styles.modalBtnText,
                { color: themed === "dark" ? themed.background : themed.text },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modalBtn,
              styles.modalBtnPrimary,
              { backgroundColor: themed.tint },
            ]}
            onPress={onCreate}
          >
            <Text
              style={[
                styles.modalBtnText,
                styles.modalBtnTextPrimary,
                { color: themed.background },
              ]}
            >
              Create
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  headerAddBtn: {
    padding: 6,
    borderRadius: 20,
  },
  tabsRow: {
    flexGrow: 0,
    flexShrink: 0,
    flexDirection: "row",
    paddingHorizontal: 8,
    marginBottom: 8,
    marginTop: 2,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: "#1976d2",
  },
  tabText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "bold",
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
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: "#1976d2",
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
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
  addBtn: {
    marginTop: 18,
    backgroundColor: "#1976d2",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: 320,
    maxWidth: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    marginBottom: 18,
    color: "#222",
    backgroundColor: "#fafbfc",
  },
  modalBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginHorizontal: 4,
  },
  modalBtnPrimary: {
    backgroundColor: "#1976d2",
  },
  modalBtnText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 15,
  },
  modalBtnTextPrimary: {
    color: "#fff",
  },
});

export default WatchlistScreen;
