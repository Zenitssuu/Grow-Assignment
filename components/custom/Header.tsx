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
import React, { useRef, useState, useEffect } from "react";
import { IconSymbol } from "../ui/IconSymbol";

const COLLAPSED_WIDTH = 36;
const EXPANDED_WIDTH = 180;

const Header = () => {
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

  // Collapse when pressing outside
  const handleOutsidePress = () => {
    if (expanded) setExpanded(false);
  };

  const handleExpand = () => {
    if (!expanded) setExpanded(true);
  };

  const handleProfilePress = () => {
    // Add your profile navigation logic here
    console.log("Profile pressed");
  };

  return (
    <Pressable
      onPress={handleOutsidePress}
      style={{ backgroundColor: "transparent" }}
    >
      <View style={styles.container} pointerEvents="box-none">
        {/* Logo on the left */}
        <View style={styles.logoContainer} pointerEvents="box-none">
          <Text style={styles.logoText}>LOGO</Text>
        </View>

        {/* Right section with search and profile */}
        <View style={styles.rightSection} pointerEvents="box-none">
          {/* Search container with fixed icon */}
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
                  { width: widthAnim },
                  expanded
                    ? styles.searchContainerExpanded
                    : styles.searchContainerCollapsed,
                ]}
              >
                {expanded ? (
                  <TextInput
                    ref={inputRef}
                    style={styles.searchInput}
                    placeholder="Search..."
                    onBlur={() => setExpanded(false)}
                    autoFocus
                  />
                ) : null}
              </Animated.View>
            </TouchableOpacity>

            {/* Fixed search icon positioned absolutely */}
            <View style={styles.searchIcon} pointerEvents="none">
              <IconSymbol size={28} name="magnifyingglass" color={`black`} />
            </View>
          </View>

          {/* Profile icon */}
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            <View style={styles.profileIconContainer}>
              <IconSymbol size={24} name="person" color="black" />
            </View>
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
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    overflow: "hidden",
    minHeight: 36,
    // paddingHorizontal: 10,
    // borderWidth:1,
    justifyContent: "flex-start",
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
    color: "#222",
    paddingVertical: 0,
    backgroundColor: "transparent",
    borderWidth: 0.5,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
    marginRight:10
  },
  profileButton: {
    padding: 5,
    marginBottom:2,
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
});
