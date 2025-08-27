// src/screens/DetailsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import ChartSection from "./ChartSection";
import { IconSymbol } from "../ui/IconSymbol";
import { useNavigation } from "@react-navigation/native";

type RangeKey = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y";

export default function DetailsScreen() {
  const [activeRange, setActiveRange] = useState<RangeKey>("1D");
  const [saved, setSaved] = useState(false);
  const navigation = useNavigation();

  return (
    <>
      {/* Custom Header */}
      <SafeAreaView style={styles.safeHeaderArea}>
        <View style={styles.customHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBtn}
          >
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.PageTitle}>Stock Details</Text>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={() => setSaved((s) => !s)}
            style={styles.headerBtn}
          >
            <IconSymbol
              name={saved ? "bookmark.fill" : "bookmark"}
              size={22}
              color={saved ? "#888" : "#888"}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Company Card */}
        <View style={styles.companyRow}>
          <View style={styles.logoWrap}>
            <Ionicons name="logo-apple" size={22} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.companyName}>APPLE INC</Text>
            <Text style={styles.subtle}>AAPL, Common Stock</Text>
            <Text style={styles.subtle}>NSQ</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.price}>$177.15</Text>
            <View style={styles.changeRow}>
              <Text style={styles.changeText}>+0.41%</Text>
              <Ionicons name="caret-up" size={14} />
            </View>
          </View>
        </View>
        {/* Chart Card (placeholder for now) */}
        <ChartSection />
        {/* About section header (content comes next piece) */}
        {/* About Section Card */}
        {/* Company Details Section */}
        <View style={styles.detailsCard}>
          {/* About */}
          <Text style={styles.aboutText}>
            Apple Inc. is an American multinational technology company that
            specializes in consumer electronics, computer software, and online
            services. It is considered one of the Big Five American information
            technology companies, alongside Alphabet, Amazon, Meta, and
            Microsoft.
          </Text>
          {/* Tags */}
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Industry: Technology</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Sector: Consumer Electronics</Text>
            </View>
          </View>
          {/* Divider */}
          <View style={styles.sectionDivider} />
          {/* 52-Week Range */}
          <View style={styles.rangeHeader}>
            <Text style={styles.sectionTitle}>52 Week Range</Text>
          </View>
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeLabel}>Low $123</Text>
            <Text style={styles.rangeLabel}>High $199</Text>
          </View>
          <View style={styles.sliderWrap}>
            <View style={styles.sliderTrack} />
            <View
              style={[styles.triangle, { left: "75%", position: "absolute" }]}
            >
              <IconSymbol name="triangle" size={18} color="black" />
            </View>
          </View>
          {/* Divider */}
          <View style={styles.sectionDivider} />
          {/* Metrics Row */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Mkt Cap</Text>
              <Text style={styles.metricValue}>$2.7T</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>P/E</Text>
              <Text style={styles.metricValue}>28.3</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Beta</Text>
              <Text style={styles.metricValue}>1.25</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Div Yield</Text>
              <Text style={styles.metricValue}>0.55%</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Profit</Text>
              <Text style={styles.metricValue}>22.4%</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const COLORS = {
  bg: "#fff",
  text: "#111827",
  subtle: "#6B7280",
  border: "#E5E7EB",
  pillBg: "#F3F4F6",
  priceUp: "#16A34A",
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
    color: COLORS.priceUp,
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
    top: 8, // below the bar
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
