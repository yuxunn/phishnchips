import styles from '@/components/Styles';
import { scanFile } from "@/components/utils/scanFile";
import { scanText } from '@/components/utils/scanText';
import { scanUrl } from "@/components/utils/scanUrl";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BarcodeScanningResult, Camera, CameraView } from "expo-camera";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Button, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DetectScreen() {
  const insets = useSafeAreaInsets();
  const [url, setUrl] = useState("");
  const [textInput, setTextInput] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const scanningRef = useRef(false);
  const [detectedScamMsg, setDetectedScamMsg] = useState<string | null>(null);
  const [isDetectedScamMsg, setIsDetectedScamMsg] = useState<boolean | null>(false);
  const [isLoading, setIsLoading] = useState<boolean | null>(false);

  // File picker handler
  const handlePickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*", "application/vnd.microsoft.portable-executable"],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setFileName(file.name);
      setFile(file)
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

    Alert.alert("Scan Successful", `The extracted url is ${result.data}`,
      [{
        text: "Start Detecting",
        onPress: () => {
          scanUrl(result.data, setDetectedScamMsg, setIsDetectedScamMsg, setIsLoading)
        },
        style: "default"
      },
      {
        text: "Cancel",
        onPress: () => {
          console.log("User cancelled.");
        },
        style: "cancel"
      }]
    );
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
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView
        contentContainerStyle={{
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 12
       }}>
        <Text style={styles.title}>Detect Scam</Text>
        <Text style={styles.blackSubtitle}>
          Choose one of the following methods to detect a potential scam:
        </Text>
        <Text style={styles.subtitle}>
          Enter a URL or domain
        </Text>
       <TextInput
          value={url}
          onChangeText={setUrl}
          placeholder="https://example.com"
          style={styles.smallInput}
          placeholderTextColor="#bbb"
        />
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => {
            if (url) {
              scanUrl(url, setDetectedScamMsg, setIsDetectedScamMsg, setIsLoading);
            } else {
              Alert.alert("Input required", "Please enter URL/domain to proceed with the scan.");
            }
          }}
        >

        
          <Text style={styles.submitBtnText}>Scan URL</Text>
        </TouchableOpacity>
        <Text style={styles.subtitle}>
          Upload suspicious file
        </Text>
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={handlePickDocument}
            activeOpacity={0.8}
          >
            <Ionicons name="attach" size={20} color="#bbb" style={{ marginBottom: 4 }} />
            <Text style={styles.supportedFilesText}>Supported files: .pdf, .jpg, .png, .exe</Text>
            {fileName && (
              <Text style={styles.selectedFileText}>{fileName}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => {
            if (file) {
              scanFile(file, setDetectedScamMsg, setIsDetectedScamMsg, setIsLoading);
            } else {
              Alert.alert("Input required", "Please upload a file to proceed with the scan.");
            }
          }}
        >
          <Text style={styles.submitBtnText}>Scan File</Text>
        </TouchableOpacity>
        <Text style={styles.subtitle}>
         Paste the contents of a message or email
        </Text>
        <TextInput
          style={[styles.input, { minHeight: 80, maxHeight: 200, paddingTop: 20, lineHeight: 20 }]}
          value={textInput}
          onChangeText={setTextInput}
          placeholder="Paste message or email content here..."
          multiline
        />
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => {
            if(textInput) {
              scanText(textInput, setDetectedScamMsg, setIsDetectedScamMsg, setIsLoading)
            } else {
              Alert.alert("Input required", "Please enter the text to proceed with the scan.");
            }
          }}
        >
          <Text style={styles.submitBtnText}>Scan Message/Email</Text>
        </TouchableOpacity>
          <Text style={styles.subtitle}>
         Scan suspicious QR code
        </Text>
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
        {isLoading && !isDetectedScamMsg && (
          <View style={{ marginTop: 32, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#232042" />
            <Text style={{ marginTop: 8, color: '#232042', fontWeight: '600' }}>Analyzing...</Text>
          </View>
        )}
        {isDetectedScamMsg ? (
          detectedScamMsg !== null && detectedScamMsg.startsWith("Beware") ? (
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 10 }}>
                <MaterialIcons name="warning" size={28} color="#F36C5E" style={{ marginRight: 8 }} />
                <Text style={{ color: "#F36C5E", fontSize: 18, fontWeight: "bold", textAlign: "center" }}>
                  {detectedScamMsg}
                </Text>
              </View>
              <View style={{ marginTop: 4 }}>
                <Text style={{ color: "black", fontSize: 16, fontWeight: "bold", lineHeight: 25 }}>
                  Next steps:{"\n"}
                  1. Help protect others! Visit the Report tab to report this scam.{"\n"}
                  2. Share this information with others on the Forum.
                </Text>
              </View>
            </View>
          )
            : (
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 10 }}>
                <Ionicons name="shield-checkmark" size={28} color="#4FE87C" style={{ marginRight: 8 }} />
                <Text style={{ color: "#4FE87C", fontSize: 18, fontWeight: "bold", textAlign: "center" }}>
                  {detectedScamMsg}
                </Text>
              </View>
            )

        ) : null}
      </ScrollView>
    </View>
  );
}
