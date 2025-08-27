import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import Header from "./Header";
import DataSection from "./DataSection";

const Home = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 64 }}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <View style={{ paddingLeft: 8, paddingRight: 8 }}>
          <DataSection title="Top Gainer" />
          <DataSection title="Top Losers" />
          {/* <View style={{ height: 24 }} /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
