import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/admin/login", {
        email,
        password
      });

      const token = res.data.token;

      await AsyncStorage.setItem("token", token);


      router.push("/dashboard",{token});
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Login failed: Vérifiez vos informations");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={styles.logo}
        />
        <Text style={styles.title}>Nutri Admin</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        © 2025 Nutri. Tous droits réservés.
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f8", justifyContent: "center", paddingHorizontal: 25 },
  logoContainer: { alignItems: "center", marginBottom: 40 },
  logo: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  title: { fontSize: 28, fontWeight: "bold", color: "#4f6d7a" },
  form: { width: "100%" },
  input: { backgroundColor: "#fff", padding: 15, borderRadius: 15, marginBottom: 15, fontSize: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  button: { backgroundColor: "#4f6d7a", padding: 15, borderRadius: 15, alignItems: "center", marginTop: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  footerText: { textAlign: "center", color: "#888", marginTop: 30, fontSize: 12 }
});
