import { View, Text } from "react-native";
import React from "react";
import Home from "@/components/custom/Home";
import { useGetTopGainerLoser } from "@/hooks/stocks.hook";
import { useDispatch } from "react-redux";
import { setList } from "@/store/topList";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { stockData, isLoading, isError, error, isSuccess } =
    useGetTopGainerLoser();

  if (isLoading) {
    return <Text>Loading!! Please Wait</Text>;
  }

  if (isError) {
    return <Text>Error:{error?.message}!! Please refresh</Text>;
  }

  let topGainers;
  let topLosers;

  const { top_gainers, top_losers } = stockData;

  if (isSuccess) {
    topGainers = stockData.top_gainers;
    topLosers = stockData.top_losers;
    dispatch(setList({ top_losers, top_gainers }));
  }

  return <Home topGainers={topGainers} topLosers={topLosers} />;
};

export default HomeScreen;
