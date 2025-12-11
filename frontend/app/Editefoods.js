// EditFood.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditFood({ food, onUpdate }) {
  const [name, setName] = useState(food.name);
  const [description, setDescription] = useState(food.description || "");
  const [calories, setCalories] = useState(food.calories?.toString() || "");
  const [sugar, setSugar] = useState(food.sugar?.toString() || "");
  const [fat, setFat] = useState(food.fat?.toString() || "");
  const [protein, setProtein] = useState(food.protein?.toString() || "");
  const [salt, setSalt] = useState(food.salt?.toString() || "");
  const [grade, setGrade] = useState(food.grade || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erreur", "Vous n'êtes pas connecté");
        setLoading(false);
        return;
      }

      await axios.put(`http://127.0.0.1:8000/api/admin/foods/${food.id}`, {
        name,
        description,
        calories: calories ? parseInt(calories) : null,
        sugar: sugar ? parseFloat(sugar) : null,
        fat: fat ? parseFloat(fat) : null,
        protein: protein ? parseFloat(protein) : null,
        salt: salt ? parseFloat(salt) : null,
        grade
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert("Succès", "Aliment mis à jour !");
      // Met à jour les valeurs dans le composant parent si besoin
      onUpdate({ ...food, name, description, calories, sugar, fat, protein, salt, grade });
    } catch (err) {
      console.log(err.response || err.message);
      Alert.alert("Erreur", "Impossible de mettre à jour l'aliment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Modifier l'aliment</Text>
        <TextInput placeholder="Nom" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
        <TextInput placeholder="Calories" value={calories} onChangeText={setCalories} keyboardType="numeric" style={styles.input} />
        <TextInput placeholder="Sucre" value={sugar} onChangeText={setSugar} keyboardType="numeric" style={styles.input} />
        <TextInput placeholder="Graisse" value={fat} onChangeText={setFat} keyboardType="numeric" style={styles.input} />
        <TextInput placeholder="Protéines" value={protein} onChangeText={setProtein} keyboardType="numeric" style={styles.input} />
        <TextInput placeholder="Sel" value={salt} onChangeText={setSalt} keyboardType="numeric" style={styles.input} />
        <TextInput placeholder="Grade" value={grade} onChangeText={setGrade} style={styles.input} />

        <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Enregistrer</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#4f6d7a" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: "#4f6d7a", padding: 12, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" }
});
