import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, FlatList, Image, Dimensions } from "react-native";
import axios from "axios";

export default function Home() {
  const [foodsCount, setFoodsCount] = useState(0);
  const [latestFoods, setLatestFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoodsData();
  }, []);

  const fetchFoodsData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/api/admin/foods", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFoodsCount(res.data.length);
      setLatestFoods(res.data.slice(-5).reverse());
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderFoodCard = ({ item }) => {
    const gradeColors = { A: "#28a745", B: "#17a2b8", C: "#ffc107", D: "#fd7e14", E: "#dc3545" };
    return (
      <View style={styles.foodCard}>
        {item.image && (
          <Image
            source={{ uri: item.image.startsWith("http") ? item.image : `http://127.0.0.1:8000${item.image}` }}
            style={styles.foodImage}
          />
        )}
        <View style={styles.foodInfo}>
          <Text style={styles.foodName}>{item.name}</Text>
          <Text style={styles.foodDetails}>Calories: {item.calories ?? "-"}</Text>
          <Text style={styles.foodDetails}>Barcode: {item.barcode ?? "-"}</Text>
          <Text style={[styles.grade, { backgroundColor: gradeColors[item.grade] || "#6c757d" }]}>{item.grade}</Text>
          <Text style={styles.foodDetails}>Created: {new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
      </View>
    );
  };

  if (loading)
    return <ActivityIndicator size="large" color="#4f6d7a" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome Admin!</Text>
        <Text style={styles.headerSubtitle}>Quick overview of your foods</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Total Foods Created</Text>
        <Text style={styles.statsCount}>{foodsCount}</Text>
      </View>

      <Text style={styles.sectionTitle}>Latest Foods</Text>
      <FlatList
        data={latestFoods}
        renderItem={renderFoodCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 15 }}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 45) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9", padding: 15 },
  header: { backgroundColor: "#4f6d7a", padding: 20, borderRadius: 12, marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#d1e0ff", marginTop: 5 },
  statsCard: { backgroundColor: "#fff", padding: 20, borderRadius: 12, marginBottom: 25, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, elevation: 5 },
  statsTitle: { fontSize: 18, fontWeight: "bold", color: "#2c3e50" },
  statsCount: { fontSize: 36, fontWeight: "bold", color: "#4f6d7a", marginTop: 10 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#2c3e50", marginBottom: 15 },
  foodCard: { width: cardWidth, backgroundColor: "#fff", borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, elevation: 5, overflow: "hidden" },
  foodImage: { width: "100%", height: 120 },
  foodInfo: { padding: 12 },
  foodName: { fontSize: 16, fontWeight: "bold", color: "#2c3e50", marginBottom: 5 },
  foodDetails: { fontSize: 12, color: "#495057", marginBottom: 3 },
  grade: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, color: "#fff", fontWeight: "bold", alignSelf: "flex-start", marginTop: 5 },
});
