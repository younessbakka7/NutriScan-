import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ClientProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      
      const response = await axios.get(
        "http://127.0.0.1:8000/api/client/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile(response.data.client);
      setLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Erreur", "Impossible de charger le profil");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f6d7a" />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={64} color="#e74c3c" />
        <Text style={styles.errorText}>Erreur de chargement</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProfile}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="person" size={80} color="#fff" />
        </View>
        <Text style={styles.name}>{profile.name || "Utilisateur"}</Text>
        <Text style={styles.email}>{profile.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations personnelles</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialIcons name="person" size={24} color="#4f6d7a" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nom</Text>
              <Text style={styles.infoValue}>{profile.name || "Non défini"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={24} color="#4f6d7a" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profile.email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={24} color="#4f6d7a" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Téléphone</Text>
              <Text style={styles.infoValue}>{profile.phone || "Non défini"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={24} color="#4f6d7a" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Membre depuis</Text>
              <Text style={styles.infoValue}>
                {profile.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : "Non défini"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert("Modifier", "Fonctionnalité à venir")}>
          <MaterialIcons name="edit" size={24} color="#4f6d7a" />
          <Text style={styles.actionButtonText}>Modifier le profil</Text>
          <MaterialIcons name="chevron-right" size={24} color="#bdc3c7" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert("Mot de passe", "Fonctionnalité à venir")}>
          <MaterialIcons name="lock" size={24} color="#4f6d7a" />
          <Text style={styles.actionButtonText}>Changer le mot de passe</Text>
          <MaterialIcons name="chevron-right" size={24} color="#bdc3c7" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8"
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#7f8c8d"
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    padding: 20
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
    marginTop: 20,
    marginBottom: 20
  },
  retryButton: {
    backgroundColor: "#4f6d7a",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  header: {
    backgroundColor: "#4f6d7a",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#3d5a66",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 4,
    borderColor: "#fff"
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5
  },
  email: {
    fontSize: 16,
    color: "#cce0ff"
  },
  section: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4f6d7a",
    marginBottom: 15
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15
  },
  infoContent: {
    marginLeft: 15,
    flex: 1
  },
  infoLabel: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 3
  },
  infoValue: {
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "500"
  },
  divider: {
    height: 1,
    backgroundColor: "#ecf0f1"
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: "#2c3e50",
    marginLeft: 15,
    fontWeight: "500"
  }
});