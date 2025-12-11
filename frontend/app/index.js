import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Index() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Top Gradient Section */}
      <LinearGradient
        colors={["#FFA500", "#2d7594ff"]}
        start={[0, 0]}
        end={[1, 1]}
        style={{
          height: 350,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 36,
            fontWeight: "bold",
            color: "white",
            fontFamily: "Doner",
            textAlign: "center",
          }}
        >
          NutriScan
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: "white",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          Scan your food and track nutrition easily
        </Text>

        {/* Small Icons */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 25,
            justifyContent: "space-around",
            width: "80%",
          }}
        >
          <Ionicons name="ios-barcode-outline" size={32} color="white" />
          <MaterialCommunityIcons name="food-apple" size={32} color="white" />
          <MaterialCommunityIcons name="chart-bar" size={32} color="white" />
        </View>
      </LinearGradient>

      {/* Middle Section - Features */}
      <View style={{ padding: 20, alignItems: "center" }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 10,
            color: "#333",
          }}
        >
          Features
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            color: "#555",
            marginBottom: 20,
          }}
        >
          NutriScan helps you track your calories, sugars, and fats. Simply scan
          the barcode of your food and get instant nutrition info!
        </Text>

        {/* Feature Icons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <MaterialCommunityIcons
              name="barcode-scan"
              size={40}
              color="#4f6d7a"
            />
            <Text style={{ marginTop: 5 }}>Scan Barcode</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <MaterialCommunityIcons
              name="food-apple-outline"
              size={40}
              color="#4f6d7a"
            />
            <Text style={{ marginTop: 5 }}>Food Info</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <MaterialCommunityIcons
              name="chart-pie"
              size={40}
              color="#4f6d7a"
            />
            <Text style={{ marginTop: 5 }}>Track Nutrition</Text>
          </View>
        </View>
      </View>

      {/* Bottom Section - Login Button */}
      <View
        style={{
          alignItems: "center",
          marginVertical: 40,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("/login")}
          style={{
            backgroundColor: "black",
            paddingVertical: 16,
            paddingHorizontal: 50,
            borderRadius: 35,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          <Text
            style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
          >
            Go to Login
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
