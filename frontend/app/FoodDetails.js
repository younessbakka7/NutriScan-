import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function FoodDetails() {
  const { foodId } = useLocalSearchParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setError("You are not logged in");
          return;
        }

        const res = await axios.get(
          `http://127.0.0.1:8000/api/admin/foods/${foodId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        setFood(res.data);
      } catch (err) {
        console.log("ERROR:", err.response?.data || err.message);
        setError("Failed to fetch food details");
      } finally {
        setLoading(false);
      }
    };

    if (foodId) fetchFood();
  }, [foodId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f6d7a" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (!food) {
    return (
      <View style={styles.center}>
        <Text>Food not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {food.image && (
        <Image
          source={{
            uri: food.image.startsWith("http")
              ? food.image
              : `http://127.0.0.1:8000${food.image}`,
          }}
          style={styles.image}
        />
      )}

      <View style={styles.infoCard}>
        <Text style={styles.title}>{food.name}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Calories:</Text>
          <Text style={styles.value}>{food.calories}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Sugar:</Text>
          <Text style={styles.value}>{food.sugar} g</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Fat:</Text>
          <Text style={styles.value}>{food.fat} g</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Protein:</Text>
          <Text style={styles.value}>{food.protein} g</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Salt:</Text>
          <Text style={styles.value}>{food.salt} g</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Grade:</Text>
          <Text style={[styles.value, { color: getGradeColor(food.grade), fontWeight: "bold" }]}>{food.grade}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const getGradeColor = (grade) => {
  switch (grade) {
    case "A": return "#28a745";
    case "B": return "#17a2b8";
    case "C": return "#ffc107";
    case "D": return "#fd7e14";
    case "E": return "#dc3545";
    default: return "#6c757d";
  }
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f5f8",
  },
  container: {
    padding: 16,
    backgroundColor: "#f2f5f8",
    flexGrow: 1,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: "cover",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
  },
  value: {
    fontSize: 16,
    color: "#343a40",
  },
});
