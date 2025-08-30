# Grow Stock App – Detailed Instructions

## Table of Contents
1. Project Overview
2. Prerequisites
3. Project Structure
4. Environment Setup
5. Running the App (Development)
6. Building for Production (APK/AAB)
7. Navigation & Routing
8. Features
9. Troubleshooting
10. Useful Commands

---

## 1. Project Overview
Grow Stock App is a Groww-style stock market application built with React Native (Expo), TypeScript, Redux Toolkit, and Express (backend). It features:
- Stock search, top gainers/losers, watchlist, and detailed stock view
- Modern UI/UX with theming and skeleton/error states
- Charting with react-native-gifted-charts
- File-based navigation using expo-router
- EAS build pipeline for APK/AAB delivery

## 2. Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Git
- Android Studio (for emulator or APK install)
- Expo account (for EAS builds)

## 3. Project Structure
```
client/
  app/                # App entry, navigation, screens
    (tabs)/           # Tab screens (Home, Watchlist)
    _layout.tsx       # Root stack layout
    index.tsx         # Redirects '/' to Home tab
    +not-found.tsx    # 404 screen
    ...
  components/         # Reusable UI components
    custom/           # Custom feature components
    ui/               # UI primitives (icons, backgrounds)
  constants/          # Theme/colors
  hooks/              # Custom hooks
  store/              # Redux store, slices
  assets/             # Images, fonts
  package.json        # Dependencies
  app.config.ts       # Expo/EAS config
  .env                # Environment variables
server/               # (If present) Express backend
```

## 4. Environment Setup
1. Clone the repo:
   ```sh
   git clone <repo-url>
   cd grow-stock-app/client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in `client/`:
   ```env
   API_KEY=<your-api-key>
   ```
4. Ensure `app.config.ts` has correct `owner` and `extra.eas.projectId` fields for EAS builds.

## 5. Running the App (Development)
1. Start Metro bundler:
   ```sh
   npx expo start
   ```
2. Scan QR code with Expo Go app or run on Android emulator:
   ```sh
   npx expo run:android
   ```
3. For a clean start (fixes routing issues):
   ```sh
   npx expo start -c
   ```

## 6. Building for Production (APK/AAB)
1. Log in to Expo:
   ```sh
   eas login
   ```
2. Build APK (cloud):
   ```sh
   eas build -p android --profile production
   ```
   - For local build: `eas build -p android --profile preview --local`
3. Download APK from the EAS build link or `dist/` folder (local).
4. Install APK on device/emulator.

## 7. Navigation & Routing
- Uses expo-router for file-based navigation.
- Main tabs: `app/(tabs)/Home.tsx`, `app/(tabs)/Watchlist.tsx`
- Root route `/` redirects to Home via `app/index.tsx`.
- Stack screens: StockDetails, TopStocksScreen, ProfileScreen, +not-found
- To add a new screen, create a new file in `app/` or `app/(tabs)/` and export a default React component.

## 8. Features
- **Home:** Top gainers/losers, search, skeleton loading, error UI
- **Watchlist:** User's saved stocks
- **Stock Details:** Chart, price, info
- **Search:** Search bar on Home, filters both gainers/losers
- **Theming:** Light/dark mode, theme context
- **Redux:** State management for stocks, watchlist
- **API:** Fetches data from backend (BASE_URL)
- **EAS Build:** Production-ready APK/AAB

## 9. Troubleshooting
- **Screen does not exist:** Ensure correct file names, default exports, and that `app/index.tsx` exists.
- **Hooks order error:** All hooks must be called at the top level, not inside conditions.
- **APK build fails:** Check `app.config.ts` for correct `owner` and `extra.eas.projectId`.
- **Navigation issues:** Clear cache with `npx expo start -c`.
- **.env not loaded:** Ensure `import "dotenv/config";` is at the top of `app.config.ts`.

## 10. Useful Commands
- Start dev server: `npx expo start`
- Clean start: `npx expo start -c`
- Run on Android: `npx expo run:android`
- Build APK: `eas build -p android --profile production`
- Login to Expo: `eas login`
- Install dependencies: `npm install`

---

For further help, see the Expo docs: https://docs.expo.dev/
