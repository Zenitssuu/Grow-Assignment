import Constants from "expo-constants";

type ExtraConfig = {
  BASE_URL: string;
  API_KEY:string
};

const extra = Constants.expoConfig?.extra as ExtraConfig;

export const BASE_URL = extra.BASE_URL;
export const API_KEY = extra.API_KEY;

