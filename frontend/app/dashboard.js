import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { MaterialIcons, FontAwesome5, Entypo, Ionicons } from '@expo/vector-icons';
import Foods from "./foods";


export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("Home");

  const tabs = [
    { name: "Home", icon: <Entypo name="home" size={24} color="#fff" /> },
    { name: "Users", icon: <FontAwesome5 name="users" size={24} color="#fff" /> },
    { name: "Foods", icon: <MaterialIcons name="restaurant" size={24} color="#fff" /> },
    { name: "Favorites", icon: <Ionicons name="heart" size={24} color="#fff" /> },
    { name: "Settings", icon: <Ionicons name="settings" size={24} color="#fff" /> }, // nouvel onglet
    { name: "Instructions", icon: <Entypo name="text-document" size={24} color="#fff" /> }
  ];

  const renderContent = () => {
    switch(selectedTab) {
      case "Home":
        return (
          <View style={[styles.card, { backgroundColor: "#a0c4ff" }]}>
            <Text style={styles.cardTitle}>Bienvenue sur NutriScan!</Text>
            <Text>Surveillez vos utilisateurs, aliments, instructions et favoris facilement.</Text>
          </View>
        );
     
      
      case "Foods":
        return (
         <Foods></Foods>
        );
    
      
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {renderContent()}
      </ScrollView>

      {/* Bottom Tab */}
      <View style={styles.bottomTab}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tabButton, selectedTab === tab.name && styles.tabButtonActive]}
            onPress={() => setSelectedTab(tab.name)}
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
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f8" },
  content: { flex: 1, padding: 15 },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#333" },

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
  tabButton: { alignItems: "center" },
  tabButtonActive: {},
  tabText: { color: "#cce0ff", fontSize: 12, marginTop: 3 },
  tabTextActive: { color: "#fff", fontWeight: "bold" },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff"
  },
  submitButton: {
    backgroundColor: "#4f6d7a",
    padding: 12,
    borderRadius: 10
  }
});
