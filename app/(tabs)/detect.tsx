import styles from '@/components/Styles';
import { scanFile } from "@/components/utils/scanFile";
import { scanText } from '@/components/utils/scanText';
import { scanUrl } from "@/components/utils/scanUrl";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BarcodeScanningResult, Camera, CameraView } from "expo-camera";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Button, Modal, Pressable, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
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
  const [isScannedText, setIsScannedText] = useState<boolean | null>(false);
  const [trustedScannedTextMsg, setTrustedScannedTextMsg] = useState<string | null>(null);
  const [scamScannedTextMsg, setScamScannedTextMsg] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (isScannedText && (trustedScannedTextMsg || scamScannedTextMsg)) {
      setModalVisible(true);
    }
  }, [isScannedText, trustedScannedTextMsg, scamScannedTextMsg]);

  useEffect(() => {
    if (isDetectedScamMsg && detectedScamMsg) {
      setModalVisible(true);
    }
  }, [isDetectedScamMsg, detectedScamMsg]);

  const onRefresh = () => {
  setRefreshing(true);
  
  // Reset all your states
  setUrl("");
  setTextInput("");
  setFileName(null);
  setFile(null);
  setDetectedScamMsg(null);
  setIsDetectedScamMsg(false);
  setIsLoading(false);
  setIsScannedText(false);
  setTrustedScannedTextMsg(null);
  setScamScannedTextMsg(null);

  // Any delay or async logic if needed
  setTimeout(() => {
    setRefreshing(false);
  }, 500); 
};


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
       }}
       refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
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
            setIsScannedText(false);
            setIsDetectedScamMsg(false);
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
            setIsDetectedScamMsg(false);
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
            setIsDetectedScamMsg(false);
            setIsScannedText(false);
            if(textInput) {
              scanText(textInput, setTrustedScannedTextMsg, setScamScannedTextMsg, setIsScannedText, setIsLoading)
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
            <Modal
              visible={modalVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
            <View style={styles.modalOverlay}>
              <View style={styles.singleModalContent}>
              <View style={styles.messageModal}>
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
              <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
              </Pressable>
              </View>
              </View>
              
            </View>
            </Modal>
          )
            : (
              <Modal
              visible={modalVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
              <View style={styles.singleModalContent}>
                <View style={styles.messageModal}>
                <Ionicons name="shield-checkmark" size={28} color="#4FE87C" style={{ marginRight: 8 }} />
                <Text style={{ color: "#4FE87C", fontSize: 18, fontWeight: "bold", textAlign: "center" }}>
                  {detectedScamMsg}
                </Text>
                </View>
                <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
              </Pressable>
              </View>
              
              </View>
              </Modal>
            )

        ) : null}

         {/* Combined message for Scan Text */}
         <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
        {isScannedText ? (
          scamScannedTextMsg !== null || trustedScannedTextMsg !== null ? (
          <View style={styles.modalOverlay}>
              {scamScannedTextMsg ? 
              <View style={styles.modalContent}>
              <View style={styles.messageModal}>
                <MaterialIcons name="warning" size={28} color="#F36C5E" style={{ marginRight: 8 }} />
                <Text style={{ color: "#F36C5E", fontSize: 18, fontWeight: "bold"}}>
                  {scamScannedTextMsg}
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
              : ""}
              
              {trustedScannedTextMsg ? 
              
              <View style={styles.modalContent}>
                <View style={styles.messageModal}>
                <Ionicons name="shield-checkmark" size={28} color="#4FE87C" style={{ marginRight: 8 }} />
                <Text style={{ color: "#4FE87C", fontSize: 18, fontWeight: "bold"}}>
                  {trustedScannedTextMsg}
                </Text>
                </View>
                 <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
                </Pressable>
              </View> : 
              ""}
              
              
          </View>
            ) : null
             ) : null}
             </Modal>
      </ScrollView>
    </View>
  );
}
