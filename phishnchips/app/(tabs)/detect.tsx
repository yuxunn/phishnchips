import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, Modal, Platform } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraView, Camera, BarcodeScanningResult } from "expo-camera";
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function DetectScreen() {
  const insets = useSafeAreaInsets();
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const scanningRef = useRef(false);

  // File picker handler
  const handlePickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*", "application/vnd.microsoft.portable-executable"], // pdf, jpg, png, exe
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFileName(result.assets[0].name);
    }
  };

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermissions();
  }, []);

  // Handles scanned QR/barcodes
  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (scanningRef.current) return;
    scanningRef.current = true;
    setScanned(true);
    setScannerVisible(false);
    alert(`Bar code of type ${result.type} and data ${result.data} has been scanned!`);
    setTimeout(() => {
      scanningRef.current = false;
    }, 1000);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={<View />}
    >
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Detect Scam</Text>
      <Text style={styles.subtitle}>Insert a URL or domain</Text>
      <TextInput
        value={url}
        onChangeText={setUrl}
        placeholder="https://example.com"
        style={styles.input}
        placeholderTextColor="#bbb"
      />

      {/* Upload Box */}
      <TouchableOpacity
        style={styles.uploadBox}
        onPress={handlePickDocument}
        activeOpacity={0.8}
      >
        <Ionicons name="attach" size={20} color="#bbb" style={{ marginBottom: 4 }} />
        <Text style={styles.uploadText}>Upload suspicious email / text message / file</Text>
        <Text style={styles.supportedFilesText}>Supported files: .pdf, .jpg, .png, .exe</Text>
        {fileName && (
          <Text style={styles.selectedFileText}>{fileName}</Text>
        )}
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitBtn}>
        <Text style={styles.submitBtnText}>Submit</Text>
      </TouchableOpacity>

      <Text style={styles.altText}>
        Alternatively, scan suspicious QR code
      </Text>

      {/* Button to open QR scanner */}
      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: "#232042", marginBottom: 0 }]}
        onPress={() => {
          setScanned(false);
          setScannerVisible(true);
        }}
      >
        <Ionicons name="qr-code" size={22} color="#fff" />
        <Text style={[styles.submitBtnText, { marginLeft: 6 }]}>Scan QR Code</Text>
      </TouchableOpacity>

      {/* QR Scan Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={scannerVisible}
        onRequestClose={() => setScannerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "pdf417"],
            }}
            style={styles.camera}
          />
          <View style={styles.modalActions}>
            <Button title="Close" onPress={() => setScannerVisible(false)} color="#fff" />
          </View>
        </View>
      </Modal>
    </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#232042",
    marginTop: 8,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#63606C",
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: "#eee",
    backgroundColor: "#F7F8FA",
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  uploadBox: {
    borderStyle: "dashed",
    borderWidth: 1.2,
    borderColor: "#ddd",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fafaff",
    marginTop: 2,
  },
  uploadText: {
    fontSize: 15,
    color: "#232042",
    marginBottom: 2,
    fontWeight: "500",
  },
  supportedFilesText: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 2,
  },
  selectedFileText: {
    fontSize: 13,
    color: "#6A8DFF",
    marginTop: 2,
  },
  submitBtn: {
    backgroundColor: "#6A8DFF",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 18,
    shadowColor: "#6A8DFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  altText: {
    alignSelf: "center",
    color: "#888",
    fontSize: 15,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(30,30,30,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: 320,
    height: 400,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 30,
  },
  modalActions: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
