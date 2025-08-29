// app.config.ts
import "dotenv/config"; // ✅ Loads .env variables at build time
import type { ExpoConfig } from "@expo/config";

const config: ExpoConfig = {
  name: "client",
  slug: "client",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "client",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,

  ios: {
    supportsTablet: true,
  },

  android: {
    package: "com.zenitssuu.growstock", 
    adaptiveIcon: {
      foregroundImage: "./assets/images/logo.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
  },

  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/logo.png",
  },

  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/logo.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
  ],

  experiments: {
    typedRoutes: true,
  },

  extra: {
    BASE_URL: process.env.BASE_URL,
    API_KEY: process.env.API_KEY,
    eas: {
      projectId: "0b0680b3-9ca2-47f4-9784-00cab1b7dc5a"
    }
  },
};

export default config;
