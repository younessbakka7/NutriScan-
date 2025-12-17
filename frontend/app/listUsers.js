import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function listUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  
  useEffect(() => {
    const getToken = async () => {
      const t = await AsyncStorage.getItem("token");
      setToken(t);
    };
    getToken();
  }, []);

  
  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);
const fetchUsers = async () => {
  try {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/admin/users",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUsers(res.data.users || []); // <-- تعديل هنا
    setLoading(false);
  } catch (error) {
    console.log(error);
    Alert.alert("Erreur", "Impossible de charger les utilisateurs");
    setLoading(false);
  }
};


  const deleteUser = async (id) => {
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer ce client ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(
                `http://127.0.0.1:8000/api/admin/users/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              // Mettre à jour la liste après suppression
              setUsers(users.filter(u => u.id !== id));
              Alert.alert("Succès", "Client supprimé avec succès");
            } catch (error) {
              console.log(error);
              Alert.alert("Erreur", "Impossible de supprimer le client");
            }
          }
        }
      ]
    );
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteUser(item.id)} style={styles.deleteButton}>
        <MaterialIcons name="delete" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f6d7a" />
        <Text style={styles.loadingText}>Chargement des utilisateurs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="people-outline" size={64} color="#bdc3c7" />
          <Text style={styles.emptyText}>Aucun utilisateur trouvé</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f8" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#7f8c8d" },
  listContainer: { paddingHorizontal: 20, paddingVertical: 20 },
  userCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: 15, borderRadius: 15, marginBottom: 15, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  userInfo: {},
  userName: { fontSize: 16, fontWeight: "bold", color: "#2c3e50" },
  userEmail: { fontSize: 14, color: "#7f8c8d", marginTop: 3 },
  deleteButton: { backgroundColor: "#e74c3c", padding: 8, borderRadius: 10 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { marginTop: 10, fontSize: 18, color: "#7f8c8d" }
});
