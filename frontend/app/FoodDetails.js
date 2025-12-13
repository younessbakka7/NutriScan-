import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";

export default function FoodDetails() {
  const params = useLocalSearchParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/foods/${params.id}`);
        setFood(res.data);
      } catch (err) {
        console.log(err.response || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [params.id]);

  if (loading) return <ActivityIndicator size="large" color="#4f6d7a" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;

  if (!food) return <Text style={{ textAlign: 'center', marginTop: 50 }}>Food not found</Text>;

  return (
    <ScrollView style={styles.container}>
      {item.image && (
          <Image
                  source={{ uri: item.image.startsWith("http") ? item.image : `http://127.0.0.1:8000${item.image}` }}
                  style={styles.foodImage}
           />
      )}

      <Text style={styles.title}>{food.name}</Text>
      <Text>Description: {food.description}</Text>
      <Text>Calories: {food.calories}</Text>
      <Text>Sugar: {food.sugar} g</Text>
      <Text>Fat: {food.fat} g</Text>
      <Text>Protein: {food.protein} g</Text>
      <Text>Salt: {food.salt} g</Text>
      <Text>Grade: {food.grade}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  image: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 }
});
