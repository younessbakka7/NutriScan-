import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { MaterialIcons, FontAwesome5, Entypo, Ionicons } from '@expo/vector-icons';
import Foods from "./foods";
import Home from "./Home";
import Settings from "./Settings";
import Users from "./listUsers"; 
import Favorites from "./AdminFavorites"; 
import { useRouter } from "expo-router";
import axios from "axios";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("Home");
  const router = useRouter();

  const tabs = [
    { name: "Home", icon: <Entypo name="home" size={24} color="#fff" /> },
    { name: "Users", icon: <FontAwesome5 name="users" size={24} color="#fff" /> },
    { name: "Foods", icon: <MaterialIcons name="restaurant" size={24} color="#fff" /> },
    { name: "Favorites", icon: <Ionicons name="heart" size={24} color="#fff" /> },
    { name: "Settings", icon: <Ionicons name="settings" size={24} color="#fff" /> }, 
    { name: "Logout", icon: <FontAwesome5 name="sign-out-alt" size={24} color="#fff" />, isLogout: true }
  ];

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post("http://127.0.0.1:8000/api/admin/logout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await AsyncStorage.removeItem("token");
      router.push("/login");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Logout failed.");
    }
  };

  const renderContent = () => {
    switch(selectedTab) {
      case "Home": return <Home />;
      case "Users": return <Users />; 
      case "Foods": return <Foods />;
      case "Settings": return <Settings />;
      case "Favorites": return <Favorites />;
      default: return <Home />;
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
  container: { flex: 1, backgroundColor: "#f0f4f8" },
  content: { flex: 1, padding: 15 },
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
  tabTextActive: { color: "#fff", fontWeight: "bold" }
});
