import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IconSymbol } from "../ui/IconSymbol";

type RootStackParamList = {
  TopStocksScreen: { title: string };
  StockDetails: Company;
};

type Company = {
  id: string;
  name: string;
  logo: string;
  price: string;
};

type DataSectionProps = {
  title?: string;
  data?: Company[];
  onViewAll?: () => void;
};

const DUMMY_DATA: Company[] = [
  {
    id: "1",
    name: "Apple",
    logo: "https://logo.clearbit.com/apple.com",
    price: "$192.32",
  },
  {
    id: "2",
    name: "Google",
    logo: "https://logo.clearbit.com/google.com",
    price: "$134.56",
  },
  {
    id: "3",
    name: "Amazon",
    logo: "https://logo.clearbit.com/amazon.com",
    price: "$3,456.78",
  },
  {
    id: "4",
    name: "Microsoft",
    logo: "https://logo.clearbit.com/microsoft.com",
    price: "$312.45",
  },
  {
    id: "5",
    name: "Uber",
    logo: "https://logo.clearbit.com/uber.com",
    price: "$312.45",
  },
  {
    id: "6",
    name: "Swiggy",
    logo: "https://logo.clearbit.com/swiggy.com",
    price: "$312.45",
  },
  {
    id: "7",
    name: "Open AI",
    logo: "https://logo.clearbit.com/openai.com",
    price: "$312.45",
  },
  {
    id: "8",
    name: "Oracle",
    logo: "https://logo.clearbit.com/oracle.com",
    price: "$312.45",
  },
];

const DataSection = ({
  title = "Top Gainer",
  data = DUMMY_DATA,
  onViewAll,
}: DataSectionProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Placeholder navigation handler
  const handleViewAll = () => {
    navigation.navigate("TopStocksScreen", { title });
  };

  const handleCardPress = (company: Company) => {
    // @ts-ignore
    navigation.navigate("StockDetails", { ...company });
  };

  const renderCompanyItem = ({ item }: { item: Company }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => handleCardPress(item)}
    >
      <View>
        <Image
          source={item.logo}
          style={styles.logo}
          contentFit="cover"
          transition={300}
          cachePolicy="memory-disk"
        />
        <Text style={styles.companyName} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
      <View>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.rate}>+61(2.87%)</Text>
      </View>
    </TouchableOpacity>
  );

  const renderViewMoreCard = () => {
    // Get remaining companies after the first 3 for the logo preview
    const remainingCompanies = data.slice(3, 7); // Show next 4 companies

    return (
      <TouchableOpacity
        style={styles.viewMoreCard}
        activeOpacity={0.8}
        onPress={handleViewAll}
      >
        <View style={styles.viewMoreContent}>
          <View style={styles.logoGrid}>
            {remainingCompanies.map((company, index) => (
              <View key={company.id || index} style={styles.logoGridItem}>
                <Image
                  source={company.logo}
                  style={styles.gridLogo}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                />
              </View>
            ))}
            {/* Fill empty slots if less than 4 companies */}
            {Array.from({ length: 4 - remainingCompanies.length }).map(
              (_, index) => (
                <View key={`empty-${index}`} style={styles.logoGridItem}>
                  <View style={styles.emptyLogo} />
                </View>
              )
            )}
          </View>
          <View style={styles.viewMoreTextContainer}>
            <Text style={styles.viewMoreText}>See more</Text>
            <IconSymbol name="chevron.right" size={20} color={"#666"} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Create grid data with view more card
  const gridData = [
    ...data.slice(0, 3),
    { id: "view-more", type: "view-more" },
  ];

  const renderGridItem = ({ item, index }: { item: any; index: number }) => {
    if (item.type === "view-more") {
      return renderViewMoreCard();
    }
    return renderCompanyItem({ item });
  };

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {/* <TouchableOpacity onPress={handleViewAll} style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity> */}
      </View>
      <FlatList
        data={gridData}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
        contentContainerStyle={{ paddingVertical: 12 }}
      />
    </View>
  );
};

export default DataSection;

const styles = StyleSheet.create({
  section: {
    // borderWidth: 1,
    // backgroundColor: "#fff",
    // borderRadius: 12,
    padding: 10,
    marginVertical: 12,
    // shadowColor: "#000",
    // shadowOpacity: 0.06,
    // shadowRadius: 8,
    // shadowOffset: { width: 0, height: 2 },
    // elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  viewAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viewAllText: {
    color: "#1976d2",
    fontWeight: "600",
    fontSize: 15,
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 18,
  },
  card: {
    borderWidth: 0.5,
    borderColor: "#adadadff",
    backgroundColor: "#f8f9fa",
    borderRadius: 14,
    flex: 1,
    alignItems: "flex-start",
    padding: 10,
    paddingLeft: 12,
    marginHorizontal: 6,
    minWidth: 0,
    height: 150,
    // elevation: 1,
    justifyContent: "space-between",
  },
  logo: {
    width: 35,
    height: 35,
    borderRadius: 10,
    marginBottom: 8,
    // backgroundColor: "#e0e0e0",
  },
  rate: {
    fontSize: 11,
    color: "#388e3c",
  },
  companyName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
    marginBottom: 6,
    textAlign: "center",
    lineHeight: 18,
  },
  price: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },
  // View More Card Styles
  viewMoreCard: {
    borderWidth: 0.5,
    borderColor: "#adadadff",
    backgroundColor: "#f8f9fa",
    borderRadius: 14,
    flex: 1,
    alignItems: "flex-start",
    // justifyContent: "center",
    padding: 14,
    marginHorizontal: 6,
    minWidth: 0,
    height: 150,
  },
  viewMoreContent: {
    height: "90%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    // borderWidth:1
  },
  logoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 70,
    height: 70,
    justifyContent: "space-evenly",
    // borderWidth:1
  },
  logoGridItem: {
    width: 35,
    height: 35,
    marginBottom: 4,
  },
  gridLogo: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
  emptyLogo: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#e8e8e8",
    opacity: 0.3,
  },
  viewMoreTextContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems:"center",
    gap:0
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
    // textAlign: "center",
    // textDecorationLine: "underline",
  },
});
