import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ActionSheetIOS, Alert, Button, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ReportScreen() {
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<{ uri: string; name?: string; type?: string } | null>(null);

  // Pick an image from library
  const pickImage = async () => {
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
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });
    if (!result.canceled) {
      const file = result.assets[0]
      setAttachment({
        uri: file.uri,
        name: file.name,
        type: 'application/pdf',
      });
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
          if (buttonIndex === 1) pickImage();
          if (buttonIndex === 2) pickDocument();
        }
      );
    } else {
      // Android: simple alert for now
      Alert.alert(
        'Select File Type',
        '',
        [
          { text: 'Image', onPress: pickImage },
          { text: 'PDF', onPress: pickDocument },
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

  return (
    <ParallaxScrollView
                headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
                headerImage={<View />}
    >
    <View style={styles.container}>
      <Text style={styles.title}>Report</Text>
      <View style={styles.infoBox}>
        <Text style={styles.subtitle}>
          Saw a potential scam? Submit a report and we will alert the relevant authorities to review it
        </Text>
        <Text style={styles.subtitle}>
          *Reports submitted here are NOT official police reports. If you have fallen for a scam, please file an official police report
        </Text>
      </View>

      <TextInput
        style={[styles.input, { minHeight: 80, maxHeight: 160 }]}
        value={input}
        onChangeText={setInput}
        placeholder="Describe the scam or suspicious activity"
        multiline
      />

      {/* Attachment preview */}
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
          <TouchableOpacity onPress={pickAttachment} style={styles.attachButton}>
            <Text style={{ color: '#007bff', fontWeight: '500' }}>Attach File</Text>
          </TouchableOpacity>
        )}
      </View>

      <Button title="Submit Report" onPress={submitReport} />
    </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
    backgroundColor: '#fafbfc',
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
    fontSize: 16,
    marginBottom: 8,
  },
  infoBox: {
    backgroundColor: "#E2F1FB",
    borderRadius: 10,
    padding: 15,
    marginBottom: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    fontSize: 16,
  },
  attachButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  attachmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    padding: 10,
  },
  attachmentName: {
    flex: 1,
    color: '#555',
    fontSize: 15,
  },
  removeAttachment: {
    color: '#d00',
    fontWeight: '600',
    marginLeft: 10,
  },
  attachmentImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
  },
  attachmentIcon: {
    fontSize: 28,
    marginRight: 10,
  },
});
