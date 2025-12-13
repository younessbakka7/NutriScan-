import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import { FontAwesome5 } from '@expo/vector-icons';
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
    return <ActivityIndicator size="large" color="#4f6d7a" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;

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

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.annually]} onPress={handleAnnually}>
            <FontAwesome5 name="calendar-alt" size={20} color="#fff" />
            <Text style={styles.buttonText}>Annually</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.logout]} onPress={handleLogout}>
            <FontAwesome5 name="sign-out-alt" size={20} color="#fff" />
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9", padding: 15 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 20
  },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
  name: { fontSize: 20, fontWeight: "bold", color: "#2c3e50", marginBottom: 5 },
  email: { fontSize: 16, color: "#495057", marginBottom: 5 },
  role: { fontSize: 14, color: "#888", marginBottom: 20 },
  buttonsContainer: { flexDirection: "row", justifyContent: "space-between", width: "80%" },
  button: { flexDirection: "row", alignItems: "center", justifyContent: "center", flex: 1, padding: 12, borderRadius: 10, marginHorizontal: 5 },
  annually: { backgroundColor: "#ffc107" },
  logout: { backgroundColor: "#dc3545" },
  buttonText: { color: "#fff", fontWeight: "bold", marginLeft: 8 }
});
