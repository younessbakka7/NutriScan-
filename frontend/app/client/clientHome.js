import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

export default function ClientHome() {
  const handleScan = () => {
    Alert.alert("Scanner", "Fonctionnalité de scan à venir");
  };

  return (
    <View style={styles.container}>
      <View style={styles.homeHeader}>
        <Text style={styles.homeTitle}>Scannez vos produits</Text>
        <Text style={styles.homeSubtitle}>Découvrez la qualité nutritionnelle de vos aliments</Text>
      </View>
      
      <View style={styles.scanSection}>
        <View style={styles.scanImageContainer}>
          <MaterialIcons name="qr-code-scanner" size={120} color="#4f6d7a" />
        </View>
        
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={handleScan}
          activeOpacity={0.8}
        >
          <MaterialIcons name="photo-camera" size={28} color="#fff" />
          <Text style={styles.scanButtonText}>Scanner un produit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCards}>
        <View style={styles.infoCard}>
          <MaterialIcons name="restaurant" size={32} color="#4f6d7a" />
          <Text style={styles.infoCardTitle}>Aliments</Text>
          <Text style={styles.infoCardText}>Base de données complète</Text>
        </View>
        
        <View style={styles.infoCard}>
          <MaterialIcons name="favorite" size={32} color="#e74c3c" />
          <Text style={styles.infoCardTitle}>Favoris</Text>
          <Text style={styles.infoCardText}>Vos produits préférés</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 20
  },
  homeHeader: {
    alignItems: "center",
    marginBottom: 30
  },
  homeTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4f6d7a",
    textAlign: "center",
    marginBottom: 10
  },
  homeSubtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    paddingHorizontal: 20
  },
  scanSection: {
    alignItems: "center",
    marginBottom: 40
  },
  scanImageContainer: {
    width: 200,
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5
  },
  scanButton: {
    backgroundColor: "#4f6d7a",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10
  },
  infoCards: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    width: "45%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4f6d7a",
    marginTop: 10,
    marginBottom: 5
  },
  infoCardText: {
    fontSize: 12,
    color: "#7f8c8d",
    textAlign: "center"
  }
});