import styles from '@/components/Styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActionSheetIOS, Alert, Image, Linking, Platform, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReportScreen() {
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<{ uri: string; name?: string; type?: string } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
  setRefreshing(true);
    setInput('');
    setFileName(null);
    setAttachment(null);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };
  // Pick an image from library
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Please allow access to your photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      const file = result.assets[0];
      setAttachment({
        uri: file.uri,
        name: file.fileName || 'image.jpg',
        type: file.type || 'image',
      });
    }
  };

  // Pick a PDF/document
  const handlePickDocument = async () => {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*", "application/vnd.microsoft.portable-executable"], // pdf, jpg, png, exe
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFileName(result.assets[0].name);
      }
  };

  // Open action sheet (iOS) or simple prompt (Android)
  const pickAttachment = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Image', 'PDF'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) handlePickImage();
          if (buttonIndex === 2) handlePickDocument();
        }
      );
    } else {
      // Android: simple alert for now
      Alert.alert(
        'Select File Type',
        '',
        [
          { text: 'Image', onPress: handlePickImage },
          { text: 'PDF', onPress: handlePickDocument },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  // Remove attachment
  const removeAttachment = () => setAttachment(null);

  // Submit report
  const submitReport = () => {
    if (!input.trim()) {
      Alert.alert('Description required', 'Please describe the issue before submitting.');
      return;
    }
    // send data to backend here...
    console.log('Report submitted:', input, attachment);
    Alert.alert('Report submitted!', 'Thank you for your report.');
    setInput('');
    setAttachment(null);
  };

  const POLICE_REPORT_URL = "https://eservices1.police.gov.sg/phub/eservices/landingpage/police-report"

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView
        contentContainerStyle={{
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 12
       }}
       refreshControl={
           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
       >
      <Text style={styles.title}>Report</Text>
      <View style={styles.infoBox}>
        <Text style={styles.blackSubtitle}>
          Saw a potential scam? Submit a report and we will alert the relevant authorities to review it
        </Text>
        <Text style={styles.warning}>
          *Reports submitted here are NOT official police reports. 
          If you have fallen for a scam, please file an official police report{' '}
          <Text style={styles.link} onPress={() => Linking.openURL(POLICE_REPORT_URL)}>here</Text>.
        </Text>
      </View>
      <Text style={styles.subtitle}>Details (max. 200 words)</Text>
      <TextInput
        style={[styles.input, { minHeight: 180, maxHeight: 250, paddingTop: 20, lineHeight: 20 }]}
        value={input}
        onChangeText={setInput}
        placeholder=""
        multiline
      />
      {/* Attachment preview */}
      <Text style={styles.subtitle}>Attachment</Text>
      <View style={{ marginBottom: 12 }}>
        {attachment ? (
          <View style={styles.attachmentBox}>
            {attachment.type && attachment.type.startsWith('image') ? (
              <Image source={{ uri: attachment.uri }} style={styles.attachmentImage} />
            ) : (
              <Text style={styles.attachmentIcon}>📄</Text>
            )}
            <Text numberOfLines={1} style={styles.attachmentName}>{attachment.name || 'Attachment'}</Text>
            <TouchableOpacity onPress={removeAttachment}>
              <Text style={styles.removeAttachment}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={handlePickDocument}
            activeOpacity={0.8}
          >
            <MaterialIcons name="attach-file" size={20} color="#bbb" style={{ marginBottom: 4 }} />
            <Text style={styles.supportedFilesText}>Supported files: .pdf, .jpg, .png, .exe</Text>
            {fileName && (
              <Text style={styles.selectedFileText}>{fileName}</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={submitReport}>
              <Text style={styles.submitBtnText}>Submit</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
    
  );
}