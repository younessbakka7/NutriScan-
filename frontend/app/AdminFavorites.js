// AdminFavorites.jsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, Platform } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export default function AdminFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      // Get token from AsyncStorage (mobile) or localStorage (web)
      const token =
        (await AsyncStorage.getItem("token")) ||
        (typeof window !== "undefined" ? localStorage.getItem("token") : null);

      console.log("Admin token:", token);

      if (!token) {
        setErrorMsg("No token found. Please log in first.");
        setLoading(false);
        return;
      }

      // Set API URL depending on the platform
      let apiURL = "http://127.0.0.1:8000/api/admin/favorites";
      if (Platform.OS === "android") {
        apiURL = "http://10.0.2.2:8000/api/admin/favorites"; // Android emulator
      }

      const res = await axios.get(apiURL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavorites(res.data);
      setLoading(false);
    } catch (err) {
      console.log("Error:", err.response || err.message);
      setErrorMsg("Error loading favorites.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading favorites...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 15 }}>
      <Text style={styles.title}>All Favorites</Text>

      {favorites.map((fav) => (
        <View key={fav.id} style={styles.card}>
           <Image
  source={{
    uri: fav.food.image.startsWith("http")
      ? fav.food.image
      : Platform.OS === "android"
      ? `http://10.0.2.2:8000${fav.food.image}`
      : `http://127.0.0.1:8000${fav.food.image}`,
  }}
  style={styles.foodImage}
/>
          <Text style={styles.clientName}>Client: {fav.client?.name}</Text>
          <Text style={styles.foodName}>Product: {fav.food?.name}</Text>
          <View style={styles.nutrition}>
            {fav.food?.calories && <Text>Calories: {fav.food.calories}</Text>}
            {fav.food?.sugar && <Text>Sugar: {fav.food.sugar}g</Text>}
            {fav.food?.fat && <Text>Fat: {fav.food.fat}g</Text>}
          </View>
          <Text style={styles.date}>
            Added on: {new Date(fav.created_at).toLocaleString()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  clientName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: "#4f6d7a",
  },
  foodName: {
    fontSize: 15,
    marginBottom: 5,
    color: "#333",
  },
  foodImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  nutrition: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: "#777",
  },
});
