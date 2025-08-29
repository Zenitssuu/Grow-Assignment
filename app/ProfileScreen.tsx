import React, { useState } from "react";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);
    // Save logic here (e.g., API call or Redux dispatch)
  };

  const colorScheme = useColorScheme() || "light";
  const themed = Colors[colorScheme];
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themed.background }] }>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.container, { backgroundColor: themed.background }]}
      >
        {/* <Text style={styles.title}>Profile</Text> */}
        <View style={styles.form}>
          <Text style={[styles.label, { color: themed.text }]}>Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: themed.background, color: themed.text, borderColor: themed.icon }]}
            value={name}
            onChangeText={setName}
            editable={editing}
            placeholder="Enter your name"
            placeholderTextColor={themed.icon}
          />
          <Text style={[styles.label, { color: themed.text }]}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: themed.background, color: themed.text, borderColor: themed.icon }]}
            value={email}
            onChangeText={setEmail}
            editable={editing}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={themed.icon}
          />
          <Text style={[styles.label, { color: themed.text }]}>Phone Number</Text>
          <TextInput
            style={[styles.input, { backgroundColor: themed.background, color: themed.text, borderColor: themed.icon }]}
            value={number}
            onChangeText={setNumber}
            editable={editing}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            placeholderTextColor={themed.icon}
          />
        </View>
        {/* {editing ? (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        )} */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 24,
    // justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 32,
    alignSelf: "center",
  },
  form: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafbfc",
    color: "#222",
  },
  editBtn: {
    backgroundColor: "#1976d2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  editBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#388e3c",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfileScreen;
