import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { updateEmail, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../../auth-context';
import { auth, storage } from '../../../firebaseConfig';

export default function EditAccountScreen() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState<string | null>(user?.photoURL || null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string } = {};
    
    if (email.trim() && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `avatars/${user?.uid}/${Date.now()}`;
      const storageRef = ref(storage, filename);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  };

  const handleSave = async () => {
    if (!validateForm() || !user) return;

    setLoading(true);
    try {
      let photoURL = user.photoURL;

      if (avatar && avatar !== user.photoURL) {
        photoURL = await uploadImage(avatar);
      }

      // Update profile in Firebase Auth
      await updateProfile(user, {
        displayName: name,
        photoURL,
      });

      // Update email if changed
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      // Create updated user object with all necessary properties
      const updatedUser = {
        ...user,
        displayName: name,
        photoURL,
        email: email !== user.email ? email : user.email,
        // Ensure we preserve the uid and other essential properties
        uid: user.uid,
        metadata: user.metadata,
        providerData: user.providerData,
      };

      // Update local state with the new user object
      setUser(updatedUser);
      
      // Force a refresh of the auth state
      await auth.currentUser?.reload();
      
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.content}>
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#232042" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Account</Text>
      </View>

      
        <View style={styles.avatarContainer}>
          <Image
            source={avatar ? { uri: avatar } : require('../../../assets/male.png')}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editBadge} onPress={pickImage}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              editable={!loading}
            />
          </View>
{/* 
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View> */}
        </View>
      

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </ScrollView>
  );
}

const AVATAR_SIZE = 100;
const EDIT_BADGE_SIZE = 32;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: EDIT_BADGE_SIZE,
    height: EDIT_BADGE_SIZE,
    borderRadius: EDIT_BADGE_SIZE / 2,
    backgroundColor: '#2A5CFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  form: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  saveButton: {
    backgroundColor: '#2A5CFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#B0B0C3',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 