import React, { useState } from "react";
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

const DUMMY_WATCHLISTS = [
  {
    name: "Default",
    stocks: [
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
        change: "-15.30 (-2.1%)",
      },
    ],
  },
  {
    name: "Tech",
    stocks: [],
  },
  {
    name: "Long-Term",
    stocks: [],
  },
];

const WatchlistScreen = () => {
  const [watchlists, setWatchlists] = useState(DUMMY_WATCHLISTS);
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const stocks = watchlists[activeTab]?.stocks || [];

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header onAdd={() => setShowModal(true)} />
        {[...Array(4)].map((_, i) => (
          <View key={i} style={styles.skeletonCard} />
        ))}
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header onAdd={() => setShowModal(true)} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Couldn't load watchlist</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => setError(false)}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // No watchlists
  if (!watchlists.length) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header onAdd={() => setShowModal(true)} />
        <View style={styles.centered}>
          <IconSymbol name="bookmark.fill" size={48} color="#bbb" />
          <Text style={styles.emptyText}>No watchlists yet</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.addBtnText}>Create New Watchlist</Text>
          </TouchableOpacity>
        </View>
        <AddModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          newListName={newListName}
          setNewListName={setNewListName}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header onAdd={() => setShowModal(true)} />
      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsRow}
      >
        {watchlists.map((wl, idx) => (
          <TouchableOpacity
            key={wl.name}
            style={[styles.tab, idx === activeTab && styles.tabActive]}
            onPress={() => setActiveTab(idx)}
          >
            <Text
              style={[
                styles.tabText,
                idx === activeTab && styles.tabTextActive,
              ]}
            >
              {wl.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Empty state for selected watchlist */}
      {stocks.length === 0 ? (
        <View style={styles.centered}>
          <IconSymbol name="magnifyingglass" size={48} color="#bbb" />
          <Text style={styles.emptyText}>No stocks in this watchlist</Text>
        </View>
      ) : (
        <FlatList
          data={stocks}
          renderItem={({ item }) => <StockRow item={item} />}
          keyExtractor={(item) => item.symbol}
          contentContainerStyle={{ paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
      )}
      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <IconSymbol name="plus" size={28} color="#fff" />
      </TouchableOpacity>
      {/* Add Modal */}
      <AddModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        newListName={newListName}
        setNewListName={setNewListName}
      />
    </SafeAreaView>
  );
};

const Header = ({ onAdd }: { onAdd: () => void }) => (
  <View style={styles.headerRow}>
    <Text style={styles.headerTitle}>Watchlist</Text>
    <TouchableOpacity style={styles.headerAddBtn} onPress={onAdd}>
      <IconSymbol name="plus" size={24} color="#1976d2" />
    </TouchableOpacity>
  </View>
);

const StockRow = ({ item }: { item: any }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isPositive = item.change.trim().startsWith("+");
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("StockDetails", { ...item })}
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
            style={{ transform: [{ rotate: isPositive ? "-90deg" : "90deg" }] }}
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

const AddModal = ({ visible, onClose, newListName, setNewListName }: any) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.modalBox}>
        <Text style={styles.modalTitle}>Create New Watchlist</Text>
        <TextInput
          style={styles.input}
          placeholder="Watchlist Name"
          value={newListName}
          onChangeText={setNewListName}
        />
        <View style={styles.modalBtnRow}>
          <TouchableOpacity style={styles.modalBtn} onPress={onClose}>
            <Text style={styles.modalBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalBtn, styles.modalBtnPrimary]}
            onPress={onClose}
          >
            <Text style={[styles.modalBtnText, styles.modalBtnTextPrimary]}>
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
