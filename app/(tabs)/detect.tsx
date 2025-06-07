import styles from '@/components/Styles';
import { Ionicons } from "@expo/vector-icons";
import { BarcodeScanningResult, Camera, CameraView } from "expo-camera";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const apiKey = "67b3d885b053d0a7bffa4f0a995c97b6d3faf9aea5c3630deeeffcd15d647a85"
// import { VIRUSTOTAL_API_KEY } from '@env';
async function scanUrl(url: string) {
  try {
    // Step 1: Submit URL for scanning
    const postOptions = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
        'x-apikey': apiKey
      },
      body: new URLSearchParams({ url }).toString(),
    };

    const postRes = await fetch('https://www.virustotal.com/api/v3/urls', postOptions);
    const postJson = await postRes.json();
    console.log(postJson)

    if (!postJson.data?.id) {
      Alert.alert("Error", "Failed to get job ID");
      return null;
    }

    const jobID = postJson.data.id;
    console.log("JOB ID", jobID);

    // Step 2: Fetch result using jobID
    const getOptions = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-apikey': apiKey
      }
    };

    // NOTE: For URL analysis, VT expects the URL id to be "base64url" encoded; 
    // if you already get the id from POST, use as is.
    const getRes = await fetch(`https://www.virustotal.com/api/v3/analyses/${jobID}`, getOptions);
    const getJson = await getRes.json();

    Alert.alert("Submitted");
    console.log(getJson);

    return getJson;
  } catch (err) {
    Alert.alert("Error", err?.toString() ?? "Unknown error");
    return null;
  }
}

async function submitScanJob(url: string) {
  console.log(url)
  try {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
        'x-apikey': "67b3d885b053d0a7bffa4f0a995c97b6d3faf9aea5c3630deeeffcd15d647a85"
      },
      body: new URLSearchParams({ url: url }).toString()
    };

    const res = await fetch('https://www.virustotal.com/api/v3/urls', options);
    const json = await res.json();
    
    Alert.alert("Submitted")
    console.log("JOB ID TEST")
    console.log(json["data"]["id"])
    return json["data"]["id"].toString();
  } catch (err) {
    return null;
  }
}



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
    Alert.alert("Scan Successful", `The extracted url is ${result.data}`,
      [ {
        text: "Start Detecting",
        onPress: () => {console.log("Detecting...")},
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView>
      <Text style={styles.title}>Detect Scam</Text>
      <Text style={styles.subtitle}>Insert a URL or domain</Text>
      <TextInput
        value={url}
        onChangeText={setUrl}
        placeholder="https://example.com"
        style={styles.smallInput}
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
      <TouchableOpacity style={styles.submitBtn} onPress={() => scanUrl(url)}>
        <Text style={styles.submitBtnText} >Submit</Text>
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
      </ScrollView>
    </View>
  );
}
