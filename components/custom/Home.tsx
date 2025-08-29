import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import React, { useContext, useState } from "react";
import { ThemeContext } from "@/theme/ThemeContext";
import Header from "./Header";
import DataSection from "./DataSection";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// Dummy data for Top Gainers
// export const TOP_GAINERS_DATA = [
//   {
//     ticker: "AAPL",
//     price: "189.98",
//     change_percentage: "2.1%",
//     change_amount: "3.90",
//   },
//   {
//     ticker: "TSLA",
//     price: "720.50",
//     change_percentage: "1.8%",
//     change_amount: "12.80",
//   },
//   {
//     ticker: "GOOGL",
//     price: "2725.60",
//     change_percentage: "1.5%",
//     change_amount: "40.10",
//   },
//   {
//     ticker: "MSFT",
//     price: "299.10",
//     change_percentage: "1.3%",
//     change_amount: "3.90",
//   },
//   {
//     ticker: "AMZN",
//     price: "3342.88",
//     change_percentage: "1.2%",
//     change_amount: "39.80",
//   },
//   {
//     ticker: "NVDA",
//     price: "220.15",
//     change_percentage: "1.1%",
//     change_amount: "2.45",
//   },
//   {
//     ticker: "META",
//     price: "355.12",
//     change_percentage: "1.0%",
//     change_amount: "3.50",
//   },
//   {
//     ticker: "NFLX",
//     price: "510.20",
//     change_percentage: "0.9%",
//     change_amount: "4.60",
//   },
//   {
//     ticker: "ADBE",
//     price: "650.30",
//     change_percentage: "0.8%",
//     change_amount: "5.20",
//   },
//   {
//     ticker: "ORCL",
//     price: "90.50",
//     change_percentage: "0.7%",
//     change_amount: "0.65",
//   },
//   {
//     ticker: "CRM",
//     price: "250.10",
//     change_percentage: "0.6%",
//     change_amount: "1.50",
//   },
//   {
//     ticker: "INTC",
//     price: "54.20",
//     change_percentage: "0.5%",
//     change_amount: "0.27",
//   },
//   {
//     ticker: "CSCO",
//     price: "58.30",
//     change_percentage: "0.4%",
//     change_amount: "0.23",
//   },
//   {
//     ticker: "PYPL",
//     price: "190.40",
//     change_percentage: "0.3%",
//     change_amount: "0.57",
//   },
//   {
//     ticker: "UBER",
//     price: "45.60",
//     change_percentage: "0.2%",
//     change_amount: "0.09",
//   },
//   {
//     ticker: "SHOP",
//     price: "140.80",
//     change_percentage: "0.1%",
//     change_amount: "0.14",
//   },
//   {
//     ticker: "SQ",
//     price: "250.90",
//     change_percentage: "0.1%",
//     change_amount: "0.25",
//   },
//   {
//     ticker: "TWTR",
//     price: "70.10",
//     change_percentage: "0.1%",
//     change_amount: "0.07",
//   },
//   {
//     ticker: "ZM",
//     price: "350.20",
//     change_percentage: "0.1%",
//     change_amount: "0.35",
//   },
//   {
//     ticker: "ROKU",
//     price: "400.30",
//     change_percentage: "0.1%",
//     change_amount: "0.40",
//   },
// ];

// // Dummy data for Top Losers
// export const TOP_LOSERS_DATA = [
//   {
//     ticker: "BABA",
//     price: "160.98",
//     change_percentage: "-2.1%",
//     change_amount: "-3.45",
//   },
//   {
//     ticker: "JD",
//     price: "75.50",
//     change_percentage: "-1.8%",
//     change_amount: "-1.38",
//   },
//   {
//     ticker: "PDD",
//     price: "95.60",
//     change_percentage: "-1.5%",
//     change_amount: "-1.45",
//   },
//   {
//     ticker: "TME",
//     price: "12.10",
//     change_percentage: "-1.3%",
//     change_amount: "-0.16",
//   },
//   {
//     ticker: "NTES",
//     price: "110.88",
//     change_percentage: "-1.2%",
//     change_amount: "-1.33",
//   },
//   {
//     ticker: "BIDU",
//     price: "180.15",
//     change_percentage: "-1.1%",
//     change_amount: "-1.98",
//   },
//   {
//     ticker: "WB",
//     price: "45.12",
//     change_percentage: "-1.0%",
//     change_amount: "-0.45",
//   },
//   {
//     ticker: "IQ",
//     price: "20.20",
//     change_percentage: "-0.9%",
//     change_amount: "-0.18",
//   },
//   {
//     ticker: "EDU",
//     price: "15.30",
//     change_percentage: "-0.8%",
//     change_amount: "-0.12",
//   },
//   {
//     ticker: "YNDX",
//     price: "70.50",
//     change_percentage: "-0.7%",
//     change_amount: "-0.49",
//   },
//   {
//     ticker: "QFIN",
//     price: "30.10",
//     change_percentage: "-0.6%",
//     change_amount: "-0.18",
//   },
//   {
//     ticker: "FUTU",
//     price: "54.20",
//     change_percentage: "-0.5%",
//     change_amount: "-0.27",
//   },
//   {
//     ticker: "TAL",
//     price: "58.30",
//     change_percentage: "-0.4%",
//     change_amount: "-0.23",
//   },
//   {
//     ticker: "VIPS",
//     price: "29.40",
//     change_percentage: "-0.3%",
//     change_amount: "-0.09",
//   },
//   {
//     ticker: "HUYA",
//     price: "18.60",
//     change_percentage: "-0.2%",
//     change_amount: "-0.04",
//   },
//   {
//     ticker: "DOYU",
//     price: "7.80",
//     change_percentage: "-0.1%",
//     change_amount: "-0.01",
//   },
//   {
//     ticker: "YY",
//     price: "80.90",
//     change_percentage: "-0.1%",
//     change_amount: "-0.08",
//   },
//   {
//     ticker: "BZUN",
//     price: "35.10",
//     change_percentage: "-0.1%",
//     change_amount: "-0.03",
//   },
//   {
//     ticker: "MOMO",
//     price: "14.20",
//     change_percentage: "-0.1%",
//     change_amount: "-0.01",
//   },
//   {
//     ticker: "GDS",
//     price: "40.30",
//     change_percentage: "-0.1%",
//     change_amount: "-0.04",
//   },
// ];

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const colorKey: "light" | "dark" = theme === "dark" ? "dark" : "light";
  const themed = Colors[colorKey];
  const [search, setSearch] = useState("");
  const { top_gainers, top_losers } = useSelector((state: RootState) => state.stockList);

  // Filter logic: search by ticker or price (case-insensitive)
  const filterStocks = (arr: any[]) =>
    arr.filter(
      (item) =>
        item.ticker?.toLowerCase().includes(search.toLowerCase()) ||
        item.price?.toLowerCase().includes(search.toLowerCase())
    );

  const filteredGainers = search ? filterStocks(top_gainers) : top_gainers;
  const filteredLosers = search ? filterStocks(top_losers) : top_losers;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themed.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 64,
          backgroundColor: themed.background,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Header searchValue={search} onSearchChange={setSearch} />
        <View style={{ paddingLeft: 8, paddingRight: 8 }}>
          <DataSection title="Top Gainer" data={filteredGainers} search={search} />
          <DataSection title="Top Losers" data={filteredLosers} search={search} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
