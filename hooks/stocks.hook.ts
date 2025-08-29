import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL, API_KEY } from "@/config/env";
import AsyncStorage from "@react-native-async-storage/async-storage";

axios.defaults.baseURL = BASE_URL;

// console.log(axios.defaults.baseURL);

export const useGetTopGainerLoser = () => {
  const baseUrl = `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`;
  const CACHE_KEY = "topGainerLoserData";
  const CACHE_TIME = 1000 * 60 * 60; // 1 hour in ms

  const getGainerLoser = async () => {
    // Try to get cached data
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TIME) {
        return data;
      }
    }
    // Fetch from API if no valid cache
    const resp = await axios.get(baseUrl);
    if (resp.status !== 200) {
      throw new Error("Failed to fetch data");
    }
    // Save to cache
    await AsyncStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data: resp.data, timestamp: Date.now() })
    );
    return resp.data;
  };

  const {
    data: stockData,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["getGainerLoserDetails"],
    queryFn: getGainerLoser,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    // No refetchInterval: only manual or after 1 hour cache expiry
  });

  return { stockData, isLoading, isError, error, isSuccess };
};

// export const useGetTopGainerLoserList = (page = 1, limit = 10) => {
//   // console.log("here");
//   const baseUrl = `/gainLose?page=${page}&limit=${limit}`;
//   // const baseUrl = `/gainLose`;
//   const getGainerLoser = async () => {
//     const resp = await axios.get(baseUrl);
//     if (resp.status !== 200) {
//       throw new Error("Failed to fetch data");
//     }
//     return resp.data;
//   };

//   const {
//     data: stockData,
//     isLoading,
//     isError,
//     error,
//     isSuccess,
//   } = useQuery({
//     queryKey: ["getGainerLoserDetails", page, limit],
//     queryFn: getGainerLoser,
//     placeholderData: undefined,
//     // refetchInterval: 1000 * 60 * 5,
//     // refetchOnMount: false,
//     // refetchOnWindowFocus: false,
//   });

//   return { stockData, isLoading, isError, error, isSuccess };
// };

export const useGetStockDetails = (company: string) => {
  const baseUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${company}&apikey=${API_KEY}`;
  const CACHE_KEY = `stockDetail_${company}`;
  const CACHE_TIME = 1000 * 60 * 60; // 1 hour in ms

  const getStockDetail = async () => {
    if (!company) return null;
    // Try to get cached data
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TIME) {
        return data;
      }
    }
    // Fetch from API if no valid cache
    const resp = await axios.get(baseUrl);
    if (resp.status !== 200) {
      throw new Error("Failed to fetch details");
    }
    // Save to cache
    await AsyncStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data: resp.data, timestamp: Date.now() })
    );
    return resp.data;
  };

  const {
    data: companyData,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["getStockDetail", company],
    queryFn: getStockDetail,
    enabled: !!company,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    // No refetchInterval: only manual or after 1 hour cache expiry
  });

  return { companyData, isLoading, isError, isSuccess, error };
};
