import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert, TextInput } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// FavoriteButton مدمج هنا مباشرة
const FavoriteButton = ({ foodId, token, initialFavorite = false, onToggle }) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  const toggleFavorite = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/client/favorite/toggle",
        { food_id: foodId },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      setIsFavorite(res.data.favorite);
      if (onToggle) onToggle(res.data.favorite);
    } catch (error) {
      console.error("Error toggling favorite:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity onPress={toggleFavorite} style={{ padding: 8 }} disabled={loading}>
      <MaterialIcons
        name={isFavorite ? "favorite" : "favorite-border"}
        size={24}
        color="#e74c3c"
      />
    </TouchableOpacity>
  );
};

// الكود الرئيسي لـ ClientFoods
export default function ClientFoods() {
  const [foods, setFoods] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const getToken = async () => {
      const t = await AsyncStorage.getItem("token");
      setToken(t);
    };
    getToken();
  }, []);

  useEffect(() => {
    if (token) fetchFoodsAndFavorites();
  }, [token]);

  const fetchFoodsAndFavorites = async () => {
    try {
      const foodsRes = await axios.get(
        "http://127.0.0.1:8000/api/foods",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFoods(foodsRes.data.foods || foodsRes.data);

      const favRes = await axios.get(
        "http://127.0.0.1:8000/api/client/favorite",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites(favRes.data.map(f => f.food_id));

      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Erreur", "Impossible de charger les aliments");
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFoodsAndFavorites();
  };

  const filteredFoods = foods.filter(food =>
    food.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.foodCard}
      onPress={() => Alert.alert(item.name, "Détails à venir")}
      activeOpacity={0.7}
    >
      <View style={styles.foodIcon}>
        <MaterialIcons name="restaurant" size={32} color="#4f6d7a" />
      </View>
      
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodCategory}>{item.category || "Non catégorisé"}</Text>
        
        <View style={styles.foodDetails}>
          <View style={styles.detailItem}>
            <MaterialIcons name="local-fire-department" size={16} color="#e74c3c" />
            <Text style={styles.detailText}>{item.calories || "N/A"} kcal</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialIcons name="fitness-center" size={16} color="#3498db" />
            <Text style={styles.detailText}>{item.proteins || "N/A"}g</Text>
          </View>
        </View>
      </View>

      <FavoriteButton 
        foodId={item.id} 
        token={token} 
        initialFavorite={favorites.includes(item.id)} 
        onToggle={(newValue) => {
          if (newValue) setFavorites([...favorites, item.id]);
          else setFavorites(favorites.filter(fId => fId !== item.id));
        }}
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f6d7a" />
        <Text style={styles.loadingText}>Chargement des aliments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Aliments</Text>
        <Text style={styles.subtitle}>{filteredFoods.length} produit(s)</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#7f8c8d" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un aliment..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#bdc3c7"
        />
        {searchQuery !== "" && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <MaterialIcons name="close" size={24} color="#7f8c8d" />
          </TouchableOpacity>
        )}
      </View>

      {filteredFoods.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="search-off" size={64} color="#bdc3c7" />
          <Text style={styles.emptyText}>Aucun aliment trouvé</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery ? "Essayez une autre recherche" : "La base de données est vide"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFoods}
          renderItem={renderFoodItem}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f8" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f4f8" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#7f8c8d" },
  header: { paddingTop: 40, paddingHorizontal: 20, paddingBottom: 20 },
  title: { fontSize: 32, fontWeight: "bold", color: "#4f6d7a", marginBottom: 5 },
  subtitle: { fontSize: 16, color: "#7f8c8d" },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", marginHorizontal: 20, marginBottom: 20, paddingHorizontal: 15, paddingVertical: 12, borderRadius: 25, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: "#2c3e50" },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  foodCard: { flexDirection: "row", backgroundColor: "#fff", padding: 15, borderRadius: 15, marginBottom: 15, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 3, alignItems: "center" },
  foodIcon: { width: 60, height: 60, backgroundColor: "#ecf0f1", borderRadius: 30, justifyContent: "center", alignItems: "center", marginRight: 15 },
  foodInfo: { flex: 1 },
  foodName: { fontSize: 18, fontWeight: "bold", color: "#2c3e50", marginBottom: 4 },
  foodCategory: { fontSize: 14, color: "#7f8c8d", marginBottom: 8 },
  foodDetails: { flexDirection: "row", gap: 15 },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  detailText: { fontSize: 13, color: "#2c3e50", fontWeight: "500" },
  favoriteButton: { padding: 8 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 },
  emptyText: { fontSize: 20, fontWeight: "bold", color: "#7f8c8d", marginTop: 20, marginBottom: 10 },
  emptySubtext: { fontSize: 14, color: "#bdc3c7", textAlign: "center" }
});
