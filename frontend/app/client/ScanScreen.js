import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { BrowserMultiFormatReader } from "@zxing/browser";
import axios from "axios";

export default function ScanScreen() {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState(null);
  const [product, setProduct] = useState(null);

  // ▶️ AUTO START CAMERA
  useEffect(() => {
    startScan();
    return () => stopScan(); // stop quand on quitte l’écran
  }, []);

  const startScan = () => {
    setBarcode(null);
    setProduct(null);

    codeReaderRef.current = new BrowserMultiFormatReader();
    setScanning(true);

    setTimeout(() => {
      codeReaderRef.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        async (result, err) => {
          if (result) {
            const scannedBarcode = result.getText();
            setBarcode(scannedBarcode);

            try {
              const res = await axios.get(
                `http://127.0.0.1:8000/api/foods/barcode/${scannedBarcode}`
              );
              setProduct(res.data);
            } catch {
              setProduct({ name: "Produit non trouvé" });
            }

            stopScan(); // stop auto après scan
          }
        }
      );
    }, 300);
  };

  const stopScan = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
    setScanning(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Scanner Produit</Text>

      {scanning && (
        <View style={styles.cameraBox}>
          <video
            ref={videoRef}
            style={styles.camera}
            autoPlay
            playsInline
            muted
          />
        </View>
      )}

    

      {barcode && (
        <View style={styles.card}>
          <Text style={styles.label}>Code-barres</Text>
          <Text style={styles.value}>{barcode}</Text>
        </View>
      )}

      {product && (
        <View style={styles.card}>
          <Text style={styles.label}>Produit</Text>
          <Text style={styles.value}>{product.name}</Text>

          {product.calories && <Text>🔥 Calories: {product.calories}</Text>}
          {product.sugar && <Text>🍬 Sucre: {product.sugar}</Text>}
          {product.fat && <Text>🧈 Graisses: {product.fat}</Text>}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  cameraBox: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#000",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: 280,
  },
  stopBtn: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 14,
    marginTop: 15,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    elevation: 3,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 5,
  },
});   