import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, Alert } from "react-native";
import axios from "axios";
import { router } from "expo-router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validation des champs
    if (!name || !email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/client/register", {
        name,
        email,
        password,
      });
      Alert.alert("Succès", "Inscription réussie!", [
        {
          text: "OK",
          onPress: () => router.push("/client/login")
        }
      ]);
    } catch (error) {
      console.log(error.response?.data);
      Alert.alert("Erreur", error.response?.data?.message || "Une erreur s'est produite");
    } finally {
      setLoading(false);
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
        <Text style={styles.title}>Nutri</Text>
        <Text style={styles.subtitle}>Créer un compte</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="Nom complet"
          style={styles.input}
          autoCapitalize="words"
          onChangeText={setName}
          value={name}
          editable={!loading}
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
          editable={!loading}
        />

        <TextInput
          placeholder="Mot de passe (min. 6 caractères)"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          editable={!loading}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Inscription..." : "S'inscrire"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkContainer}
          onPress={() => router.push("/client/clientLogin")}
          disabled={loading}
        >
          <Text style={styles.linkText}>
            Vous avez déjà un compte? <Text style={styles.linkBold}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        © 2025 Nutri. Tous droits réservés.
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f0f4f8", 
    justifyContent: "center", 
    paddingHorizontal: 25 
  },
  logoContainer: { 
    alignItems: "center", 
    marginBottom: 40 
  },
  logo: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    marginBottom: 15 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#4f6d7a" 
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginTop: 5
  },
  form: { 
    width: "100%" 
  },
  input: { 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 15, 
    fontSize: 16, 
    shadowColor: "#000", 
    shadowOpacity: 0.05, 
    shadowRadius: 5, 
    elevation: 3 
  },
  button: { 
    backgroundColor: "#4f6d7a", 
    padding: 15, 
    borderRadius: 15, 
    alignItems: "center", 
    marginTop: 10, 
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 5 
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center"
  },
  linkText: {
    color: "#888",
    fontSize: 14
  },
  linkBold: {
    color: "#4f6d7a",
    fontWeight: "bold"
  },
  footerText: { 
    textAlign: "center", 
    color: "#888", 
    marginTop: 30, 
    fontSize: 12 
  }
});