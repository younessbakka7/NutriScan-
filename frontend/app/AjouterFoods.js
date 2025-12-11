import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

export default function CreateFood({ onCreate, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [sugar, setSugar] = useState("");
  const [fat, setFat] = useState("");
  const [protein, setProtein] = useState("");
  const [salt, setSalt] = useState("");
  const [grade, setGrade] = useState("");
  const [barcode, setBarcode] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ouvrir la galerie pour choisir une image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert("Erreur", "Le nom est requis");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("calories", calories);
      formData.append("sugar", sugar);
      formData.append("fat", fat);
      formData.append("protein", protein);
      formData.append("salt", salt);
      formData.append("grade", grade);
      formData.append("barcode", barcode);

      // Ajouter l'image correctement
      if (image) {
        let localUri = image.uri;
        let filename = localUri.split("/").pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1] === "jpg" ? "jpeg" : match[1]}` : `image`;

        formData.append("image", {
          uri: Platform.OS === "ios" ? localUri.replace("file://", "") : localUri,
          name: filename,
          type,
        });
      }

      const res = await axios.post("http://127.0.0.1:8000/api/admin/foods", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Succès", "Aliment ajouté !");
      onCreate(res.data);

      // Réinitialiser le formulaire
      setName("");
      setDescription("");
      setCalories("");
      setSugar("");
      setFat("");
      setProtein("");
      setSalt("");
      setGrade("");
      setBarcode("");
      setImage(null);
      onClose();
    } catch (err) {
      console.log(err.response?.data || err.message);
      Alert.alert("Erreur", "Impossible d'ajouter l'aliment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Ajouter un nouvel aliment</Text>

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.buttonText}>{image ? "Changer l'image" : "Ajouter une image"}</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image.uri }} style={styles.preview} />}

        <TextInput placeholder="Nom" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
        <TextInput placeholder="Calories" value={calories} onChangeText={setCalories} keyboardType="numeric" style={styles.input} />
        <TextInput placeholder="Sucre" value={sugar} onChangeText={setSugar} keyboardType="numeric" style={styles.input} />
        <TextInput placeholder="Graisse" value={fat} onChangeText={setFat} keyboardType="numeric" style={styles.input} />
        <TextInput placeholder="Protéines" value={protein} onChangeText={setProtein} keyboardType="numeric" style={styles.input} />
        <TextInput placeholder="Sel" value={salt} onChangeText={setSalt} keyboardType="numeric" style={styles.input} />
        <TextInput placeholder="Grade" value={grade} onChangeText={setGrade} style={styles.input} />
        <TextInput placeholder="Barcode" value={barcode} onChangeText={setBarcode} style={styles.input} />

        <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ajouter</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: "#aaa", marginTop: 10 }]} onPress={onClose}>
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 12, elevation: 3 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#4f6d7a" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: "#4f6d7a", padding: 12, borderRadius: 10, alignItems: "center", marginTop: 10 },
  imageButton: { backgroundColor: "#4f6d7a", padding: 12, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  preview: { width: "100%", height: 150, borderRadius: 10, marginBottom: 10 },
});
