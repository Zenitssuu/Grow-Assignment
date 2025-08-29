import React, { useContext } from "react";
import { Colors } from "@/constants/Colors";
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
import { tickerToCompanyName } from "../../constants/CompanyNames";
import { ThemeContext } from "@/theme/ThemeContext";

type RootStackParamList = {
  TopStocksScreen: { title: string };
  StockDetails: Company;
};

type Company = {
  ticker: string;
  price: string;
  change_percentage: string;
  change_amount: string;
};

type DataSectionProps = {
  title?: string;
  data?: Company[];
  search?: string;
};

const DataSection = ({ title = "Top Gainer", data = [], search = "" }: DataSectionProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme } = useContext(ThemeContext);
  const colorKey: "light" | "dark" = theme === "dark" ? "dark" : "light";
  const themed = Colors[colorKey];

  // Placeholder navigation handler
  const handleViewAll = () => {
    navigation.navigate("TopStocksScreen", { title });
  };

  const handleCardPress = (company: Company) => {
    // @ts-ignore
    console.log("company", company);
    navigation.navigate("StockDetails", { ...company });
  };

  const renderCompanyItem = ({ item }: { item: Company }) => {
    // console.log(item);
    const companyName =
      tickerToCompanyName[item?.ticker]?.split(" ")[0] ?? item.ticker;

    const companyLogo =
      tickerToCompanyName[item?.ticker]?.split(" ")[0] ?? "Company";
    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: themed.background,
            borderColor: themed.icon,
            shadowColor: themed.text,
          },
        ]}
        activeOpacity={0.8}
        onPress={() => handleCardPress(item)}
      >
        <View>
          <Image
            source={`https://logo.clearbit.com/${companyLogo}.com`}
            style={styles.logo}
            contentFit="cover"
            transition={300}
            cachePolicy="memory-disk"
          />
          <Text
            style={[styles.companyName, { color: themed.text }]}
            numberOfLines={2}
          >
            {companyName}
          </Text>
        </View>
        <View>
          <Text style={[styles.price, { color: themed.text }]}>
            ${item.price}
          </Text>
          <Text
            style={[
              styles.rate,
              {
                color:
                  title === "Top Gainer"
                    ? theme === "dark"
                      ? "#4caf50"
                      : "#388e3c"
                    : theme === "dark"
                    ? "#ff5252"
                    : "#ff0000ff",
              },
            ]}
          >
            {title === "Top Gainer" ? "+" : ""}
            {item.change_amount} (
            {title === "Top Gainer"
              ? item.change_percentage
              : item.change_percentage.split("-")[1]}
            )
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderViewMoreCard = () => {
    // Get remaining companies after the first 3 for the logo preview
    const remainingCompanies = data.slice(3, 7); // Show next 4 companies

    return (
      <TouchableOpacity
        style={[
          styles.viewMoreCard,
          {
            backgroundColor: themed.background,
            borderColor: themed.icon,
            shadowColor: themed.text,
          },
        ]}
        activeOpacity={0.8}
        onPress={handleViewAll}
      >
        <View style={styles.viewMoreContent}>
          <View style={styles.logoGrid}>
            {remainingCompanies.map((company, index) => {
              const companyName =
                tickerToCompanyName[company?.ticker]?.split(" ")[0] ??
                "Company";
              return (
                <View key={company.ticker || index} style={styles.logoGridItem}>
                  <Image
                    source={
                      `https://logo.clearbit.com/${companyName}.com` ||
                      `https://logo.clearbit.com/nexalin.com`
                    }
                    style={styles.gridLogo}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                  />
                </View>
              );
            })}
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
            <Text style={[styles.viewMoreText, { color: themed.text }]}>
              See more
            </Text>
            <IconSymbol
              style={styles.viewMoreIcon}
              name="chevron.right"
              size={20}
              color={themed.icon}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // If searching, just show all matched stocks (no view more)
  const gridData = search
    ? data
    : [
        ...data.slice(0, 3),
        { id: "view-more", type: "view-more" },
      ];

  const renderGridItem = ({ item, index }: { item: any; index: number }) => {
    if (!search && item.type === "view-more") {
      return renderViewMoreCard();
    }
    return renderCompanyItem({ item });
  };

  // console.log(data.length);

  return (
    <View style={[styles.section, { backgroundColor: themed.background }]}> 
      {!search && (
        <View style={styles.headerRow}>
          <Text style={[styles.sectionTitle, { color: themed.text }]}> 
            {title}
          </Text>
        </View>
      )}
      <FlatList
        data={gridData}
        renderItem={renderGridItem}
        keyExtractor={(item, index) =>
          "ticker" in item ? item.ticker : index.toString()
        }
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
    // color: "#388e3c",
    fontWeight: "600",
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
    alignItems: "center",
    gap: -5,
    marginTop: 15,
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666",
    // textAlign: "center",
    // textDecorationLine: "underline",
  },
  viewMoreIcon: {
    marginLeft: -1,
    marginTop: 2,
  },
});
