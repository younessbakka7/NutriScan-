import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Settings() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmin(res.data.admin);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnnually = () => {
    router.push("/dashboard");
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://127.0.0.1:8000/api/admin/logout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      router.push("/login");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Logout failed.");
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f6d7a" />
      </View>
    );

  if (!admin) return <Text style={{ textAlign: "center", marginTop: 50 }}>No admin data found.</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{admin.name}</Text>
        <Text style={styles.email}>{admin.email}</Text>
        <Text style={styles.role}>{admin.role}</Text>

        <View style={styles.statsContainer}>
         
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>9</Text>
            <Text style={styles.statLabel}>Foods</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Clients</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.annually]} onPress={handleAnnually}>
            <FontAwesome5 name="calendar-alt" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.logout]} onPress={handleLogout}>
            <FontAwesome5 name="sign-out-alt" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9eef7",
    padding: 15,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#4f6d7a",
    marginBottom: 15,
  },
  name: { fontSize: 24, fontWeight: "700", color: "#2c3e50", marginBottom: 4 },
  email: { fontSize: 16, color: "#495057", marginBottom: 2 },
  role: { fontSize: 14, color: "#888", marginBottom: 20 },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 25,
  },
  statBox: { alignItems: "center" },
  statNumber: { fontSize: 20, fontWeight: "700", color: "#4f6d7a" },
  statLabel: { fontSize: 12, color: "#6c757d" },
  buttonsContainer: { flexDirection: "row", justifyContent: "space-between", width: "60%" },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  annually: { backgroundColor: "#ffc107" },
  logout: { backgroundColor: "#dc3545" },
});
