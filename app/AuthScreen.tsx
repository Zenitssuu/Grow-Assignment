import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSignup, useLogin } from "@/hooks/user.hook";

const AuthScreen = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const {
    mutate: signup,
    isLoading: signupLoading,
    error: signupError,
    data: signupData,
  } = useSignup();
  const {
    mutate: login,
    isLoading: loginLoading,
    error: loginError,
    data: loginData,
  } = useLogin();

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (isSignup) {
      signup({
        name: form.name,
        email: form.email,
        password: form.password,
        number: form.number,
      });
    } else {
      login({
        email: form.email,
        password: form.password,
      });
    }
  };

  const error = isSignup ? signupError : loginError;
  const loading = isSignup ? signupLoading : loginLoading;
  const data = isSignup ? signupData : loginData;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{isSignup ? "Sign Up" : "Login"}</Text>
          {isSignup && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(v) => handleChange("name", v)}
                placeholder="Enter your name"
                autoCapitalize="words"
              />
            </View>
          )}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(v) => handleChange("email", v)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {isSignup && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={form.number}
                onChangeText={(v) => handleChange("number", v)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>
          )}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={form.password}
              onChangeText={(v) => handleChange("password", v)}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.showPasswordBtn}
              onPress={() => setShowPassword((s) => !s)}
            >
              <Text style={styles.showPasswordText}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
          {error && (
            <Text style={styles.errorText}>{error.message || "Something went wrong"}</Text>
          )}
          {data && (
            <Text style={styles.successText}>Success!</Text>
          )}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>
                {isSignup ? "Sign Up" : "Login"}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => setIsSignup((s) => !s)}
            disabled={loading}
          >
            <Text style={styles.switchBtnText}>
              {isSignup
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    alignItems: "stretch",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 24,
    alignSelf: "center",
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    color: "#555",
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafbfc",
    color: "#222",
  },
  showPasswordBtn: {
    position: "absolute",
    right: 10,
    top: 36,
    padding: 4,
  },
  showPasswordText: {
    color: "#1976d2",
    fontSize: 13,
  },
  submitBtn: {
    backgroundColor: "#1976d2",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  switchBtn: {
    marginTop: 18,
    alignItems: "center",
  },
  switchBtnText: {
    color: "#1976d2",
    fontSize: 15,
    fontWeight: "500",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 15,
    marginBottom: 8,
    textAlign: "center",
  },
  successText: {
    color: "#388e3c",
    fontSize: 15,
    marginBottom: 8,
    textAlign: "center",
  },
});

export default AuthScreen;
