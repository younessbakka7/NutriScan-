import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import ClientHome from "./clientHome";
import ClientProfile from "./profile";
import ClientFoods from "./clientFoods";



// Composant Foods
function Foods() {
  return (
    <ClientFoods />
  );
}

// Composant Profile
function Profile() {
  return (
   <ClientProfile />
  );
}

// Composant Favorites
function Favorites() {
  return (
    <View style={styles.pageContainer}>
      <Text style={styles.pageTitle}>Favoris</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>Vos aliments favoris</Text>
      </View>
    </View>
  );
}

// Composant Settings
function Settings() {
  return (
    <View style={styles.pageContainer}>
      <Text style={styles.pageTitle}>Scanner</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>Scanner le code-barres</Text>
      </View>
    </View>
  );
}

export default function ClientDashboard() {
  const [selectedTab, setSelectedTab] = useState("Home");

  const tabs = [
    { name: "Home", icon: <MaterialIcons name="home" size={24} color="#fff" /> },
    { name: "Foods", icon: <MaterialIcons name="restaurant" size={24} color="#fff" /> },
    { name: "Favorites", icon: <MaterialIcons name="favorite" size={24} color="#fff" /> },
    { name: "Profile", icon: <MaterialIcons name="person" size={24} color="#fff" /> },
    { name: "Scan", icon: <MaterialIcons name="qr-code-scanner" size={24} color="#fff" /> },
    { name: "Logout", icon: <MaterialIcons name="logout" size={24} color="#fff" />, isLogout: true }
  ];

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      
      await axios.post(
        "http://127.0.0.1:8000/api/client/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await AsyncStorage.removeItem("token");
      router.replace("/client/clientLogin");
    } catch (error) {
      console.log(error);
      await AsyncStorage.removeItem("token");
      router.replace("/client/clientLogin");
    }
  };

  const renderContent = () => {
    switch(selectedTab) {
      case "Home": return <ClientHome />;
      case "Foods": return <Foods />;
      case "Profile": return <Profile />;
      case "Favorites": return <Favorites />;
      case "Scan": return <Settings />;
      default: return <ClientHome />;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {renderContent()}
      </ScrollView>

      <View style={styles.bottomTab}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tabButton, selectedTab === tab.name && styles.tabButtonActive]}
            onPress={() => {
              if(tab.isLogout) handleLogout();
              else setSelectedTab(tab.name);
            }}
            activeOpacity={0.8}
          >
            {tab.icon}
            <Text style={[styles.tabText, selectedTab === tab.name && styles.tabTextActive]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f0f4f8" 
  },
  content: { 
    flex: 1, 
    padding: 15 
  },
  pageContainer: {
    paddingTop: 40,
    paddingBottom: 20
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4f6d7a",
    marginBottom: 20
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3
  },
  cardText: {
    fontSize: 16,
    color: "#333"
  },
  bottomTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#4f6d7a",
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10
  },
  tabButton: { 
    alignItems: "center" 
  },
  tabButtonActive: {},
  tabText: { 
    color: "#cce0ff", 
    fontSize: 12, 
    marginTop: 3 
  },
  tabTextActive: { 
    color: "#fff", 
    fontWeight: "bold" 
  }
});