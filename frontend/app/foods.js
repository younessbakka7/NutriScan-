import React, { useEffect, useState } from "react";
import { 
  View, Text, ScrollView, StyleSheet, ActivityIndicator, 
  Image, StatusBar, TouchableOpacity, Alert 
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditFood from "./Editefoods";
import CreateFood from "./AjouterFoods";
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from "expo-router";

export default function Foods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingFood, setEditingFood] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const router = useRouter();

  const fetchFoods = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("You are not logged in");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://127.0.0.1:8000/api/admin/foods", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFoods(res.data);
    } catch (err) {
      console.log(err.response || err.message);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFoods(); }, []);

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/admin/foods/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Deleted", "Food removed successfully!");
      setFoods(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.log(err.response || err.message);
      Alert.alert("Error", "Cannot delete this food");
    }
  };

  const handleUpdate = (updatedFood) => {
    setFoods(prev => prev.map(f => f.id === updatedFood.id ? updatedFood : f));
    setEditingFood(null);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#4f6d7a" /></View>;
  if (error) return <View style={styles.center}><Text style={{ color: "red" }}>{error}</Text></View>;
  if (editingFood) return <EditFood food={editingFood} onUpdate={handleUpdate} />;

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#4f6d7a" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Food List</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setShowCreate(true)}>
        <FontAwesome5 name="plus" size={18} color="#fff" />
        <Text style={[styles.buttonText, { marginLeft: 8 }]}>Add Food</Text>
      </TouchableOpacity>

      {showCreate && (
        <CreateFood 
          onClose={() => setShowCreate(false)} 
          onCreate={(newFood) => {
            setFoods(prev => [newFood, ...prev]);
            setShowCreate(false);
          }} 
        />
      )}

      <ScrollView contentContainerStyle={styles.container}>
        {foods.length === 0 ? <Text style={styles.noFoodText}>No foods available</Text> : (
          foods.map(food => (
            <View key={food.id} style={styles.card}>
              {food.image && (
                <Image 
                  source={{ uri: food.image.startsWith('http') ? food.image : `http://127.0.0.1:8000${food.image}` }} 
                  style={styles.image} 
                />
              )}

              <View style={styles.cardContent}>
                <Text style={styles.foodName}>{food.name}</Text>
                {food.description && <Text style={styles.description}>{food.description}</Text>}

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Barcode:</Text>
                  <Text style={styles.infoValue}>{food.barcode}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Calories:</Text>
                  <Text style={styles.infoValue}>{food.calories}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Sugar:</Text>
                  <Text style={styles.infoValue}>{food.sugar} g</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Fat:</Text>
                  <Text style={styles.infoValue}>{food.fat} g</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Protein:</Text>
                  <Text style={styles.infoValue}>{food.protein} g</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Salt:</Text>
                  <Text style={styles.infoValue}>{food.salt} g</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Grade:</Text>
                  <Text style={[styles.grade, { backgroundColor: getGradeColor(food.grade) }]}>{food.grade}</Text>
                </View>

                <View style={styles.buttons}>
                  <TouchableOpacity style={styles.iconButton} onPress={() => setEditingFood(food)}>
                    <FontAwesome5 name="edit" size={18} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.iconButton, { backgroundColor: "#28a745" }]} 
                    onPress={() => router.push({ pathname: "/FoodDetails", params: { foodId: food.id } })}
                  >
                    <FontAwesome5 name="info-circle" size={18} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.iconButton, { backgroundColor: "#ff4d4d" }]} onPress={() => handleDelete(food.id)}>
                    <FontAwesome5 name="trash" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const getGradeColor = (grade) => {
  switch(grade) {
    case "A": return "#28a745";
    case "B": return "#17a2b8";
    case "C": return "#ffc107";
    case "D": return "#fd7e14";
    case "E": return "#dc3545";
    default: return "#6c757d";
  }
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f2f2f2" },
  header: {
    backgroundColor: "#4f6d7a",
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  headerText: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  container: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  noFoodText: { fontSize: 16, textAlign: "center", marginTop: 20, color: "#6c757d" },
  card: { 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  image: { 
    width: "100%", 
    height: 180, 
    resizeMode: "cover",
  },
  cardContent: { padding: 12 },
  foodName: { fontSize: 20, fontWeight: "700", color: "#2c3e50", marginBottom: 6 },
  description: { fontSize: 14, color: "#495057", marginBottom: 10 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  infoLabel: { fontSize: 14, fontWeight: "600", color: "#495057" },
  infoValue: { fontSize: 14, color: "#343a40" },
  grade: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 7, color: "#fff", fontWeight: "700" },
  buttons: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
  iconButton: { backgroundColor: "#4f6d7a", padding: 10, borderRadius: 8, marginLeft: 8 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  addButton: { flexDirection: "row", backgroundColor: "#4f6d7a", padding: 12, borderRadius: 10, margin: 16, alignItems: "center", justifyContent: "center" }
});
