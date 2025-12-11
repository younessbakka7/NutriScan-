// Foods.js
import React, { useEffect, useState } from "react";
import { 
  View, Text, ScrollView, StyleSheet, ActivityIndicator, 
  Image, StatusBar, TouchableOpacity, Alert 
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditFood from "./Editefoods";
import CreateFood from "./AjouterFoods";

export default function Foods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingFood, setEditingFood] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchFoods = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("Vous n'êtes pas connecté");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://127.0.0.1:8000/api/admin/foods", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFoods(res.data);
    } catch (err) {
      console.log(err.response || err.message);
      setError("Erreur lors de la récupération des données");
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
      Alert.alert("Supprimé", "Aliment supprimé !");
      setFoods(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.log(err.response || err.message);
      Alert.alert("Erreur", "Impossible de supprimer l'aliment");
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
        <Text style={styles.headerText}>Liste des Aliments</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setShowCreate(true)}>
        <Text style={styles.buttonText}>Ajouter un aliment</Text>
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
        {foods.length === 0 ? <Text>Aucun aliment à afficher</Text> : (
          foods.map(food => (
            <View key={food.id} style={styles.card}>
              {food.image && (
                <View style={{ position: "relative" }}>
                  <Image 
                    source={{ uri: food.image.startsWith('http') ? food.image : `http://127.0.0.1:8000${food.image}` }} 
                    style={styles.image} 
                  />
                  <View style={styles.overlay}>
                    <Text style={styles.overlayText}>{food.name}</Text>
                  </View>
                </View>
              )}

              {!food.image && <Text style={styles.name}>{food.name}</Text>}

              <Text style={styles.description}>{food.description}</Text>
              <Text style={styles.info}>Code-barres: {food.barcode}</Text>
              <Text style={styles.info}>Calories: {food.calories}</Text>
              <Text style={styles.info}>Sucre: {food.sugar} g</Text>
              <Text style={styles.info}>Graisse: {food.fat} g</Text>
              <Text style={styles.info}>Protéines: {food.protein} g</Text>
              <Text style={styles.info}>Sel: {food.salt} g</Text>
              <Text style={styles.info}>Grade: {food.grade}</Text>

              <View style={styles.buttons}>
                <TouchableOpacity style={styles.editButton} onPress={() => setEditingFood(food)}>
                  <Text style={styles.buttonText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(food.id)}>
                  <Text style={styles.buttonText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

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
  headerText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  container: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    overflow: "hidden", // important pour les coins arrondis
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  image: { 
    width: "100%", 
    height: 180, 
    borderTopLeftRadius: 12, 
    borderTopRightRadius: 12,
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  overlayText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  name: { fontSize: 18, fontWeight: "bold", margin: 8, color: "#4f6d7a" },
  description: { marginBottom: 8, marginHorizontal: 8 },
  info: { marginBottom: 2, marginHorizontal: 8, color: "#333" },
  buttons: { flexDirection: "row", justifyContent: "space-between", margin: 10 },
  editButton: { backgroundColor: "#4f6d7a", padding: 10, borderRadius: 8, flex: 1, marginRight: 5 },
  deleteButton: { backgroundColor: "#ff4d4d", padding: 10, borderRadius: 8, flex: 1, marginLeft: 5 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  addButton: { backgroundColor: "#4f6d7a", padding: 12, borderRadius: 10, margin: 16, alignItems: "center" }
});
