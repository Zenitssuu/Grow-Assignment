import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Animated,
  Pressable,
  Keyboard,
} from "react-native";
import React, { useRef, useState, useEffect, useContext } from "react";
import { ThemeContext } from "@/theme/ThemeContext";
import { IconSymbol } from "../ui/IconSymbol";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import logo from "../../assets/images/logo.png";
import { Image } from "expo-image";

const COLLAPSED_WIDTH = 36;
const EXPANDED_WIDTH = 180;

interface HeaderProps {
  searchValue: string;
  onSearchChange: (text: string) => void;
}

const Header = ({ searchValue, onSearchChange }: HeaderProps) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const colorKey: "light" | "dark" = theme === "dark" ? "dark" : "light";
  const themed = Colors[colorKey];
  const navigation = useNavigation<any>();
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const widthAnim = useRef(new Animated.Value(COLLAPSED_WIDTH)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
      duration: 220,
      useNativeDriver: false,
    }).start();
    if (expanded) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
    } else {
      Keyboard.dismiss();
    }
  }, [expanded]);

  const handleOutsidePress = () => {
    if (expanded) setExpanded(false);
  };
  const handleExpand = () => {
    if (!expanded) setExpanded(true);
  };

  return (
    <Pressable
      onPress={handleOutsidePress}
      style={{ backgroundColor: "transparent" }}
    >
      <View
        style={{ ...styles.container, borderBottomColor: themed.icon }}
        pointerEvents="box-none"
      >
        <View style={styles.logoContainer} pointerEvents="box-none">
          <Image source={logo} style={styles.logoImage} />
          <Text style={[styles.logoText, { color: themed.tint }]}>Grow</Text>
        </View>
        <View style={styles.rightSection} pointerEvents="box-none">
          <View style={styles.searchWrapper}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.searchTouchable}
              onPress={(e) => {
                e.stopPropagation();
                handleExpand();
              }}
            >
              <Animated.View
                style={[
                  styles.searchContainer,
                  {
                    width: widthAnim,
                    backgroundColor: themed.background,
                    borderColor: themed.icon,
                  },
                  expanded
                    ? styles.searchContainerExpanded
                    : styles.searchContainerCollapsed,
                ]}
              >
                {expanded ? (
                  <TextInput
                    ref={inputRef}
                    style={[
                      styles.searchInput,
                      {
                        color: themed.text,
                        backgroundColor: themed.background,
                        borderColor: themed.icon,
                      },
                    ]}
                    placeholder="Search..."
                    placeholderTextColor={themed.icon}
                    value={searchValue}
                    onChangeText={onSearchChange}
                    onBlur={() => setExpanded(false)}
                    autoFocus
                  />
                ) : null}
              </Animated.View>
            </TouchableOpacity>
            <View style={styles.searchIcon} pointerEvents="none">
              <IconSymbol
                size={28}
                name="magnifyingglass"
                color={themed.icon}
              />
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.themeToggleBtn,
              {
                backgroundColor: themed.background,
                borderColor: themed.icon,
                borderWidth: 1,
              },
            ]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <IconSymbol
              size={24}
              name={theme !== "dark" ? "sun.max" : "moon"}
              color={theme !== "dark" ? "#FFD600" : themed.text}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 1,
    borderBottomWidth: 2,
    borderBottomColor: "#e0e0e0",
    zIndex: 10,
  },
  logoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  logoImage: {
    width: 25,
    height: 25,
    borderRadius: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchWrapper: {
    position: "relative",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // borderWidth:1,
  },
  searchTouchable: {
    // marginLeft removed since it's now in rightSection
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    overflow: "hidden",
    minHeight: 36,
    justifyContent: "flex-start",
    // borderWidth: 1,
  },
  searchContainerCollapsed: {},
  searchContainerExpanded: {
    paddingLeft: 40, // Make space for the fixed icon
    paddingRight: 10,
  },
  searchIcon: {
    position: "absolute",
    right: -12,
    justifyContent: "center",
    alignItems: "center",
    width: 36,
    height: 36,
    zIndex: 1,
    // borderWidth:1,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 0,
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
    marginRight: 10,
  },
  profileButton: {
    padding: 5,
    marginBottom: 2,
    // borderRadius: 20,
    backgroundColor: "#f8f9fa",
    borderWidth: 2,
    borderRadius: "100%",
    borderStyle: "dashed",
    borderColor: "#a8a8a8",
  },
  profileIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  themeToggleBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginLeft: 8,
  },
});
