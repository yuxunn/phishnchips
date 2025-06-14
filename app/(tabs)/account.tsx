
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useAuth } from '../../auth-context';

export default function AccountScreen() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    router.replace('/auth/login');
  };

  const menu = [
    { label: 'Favourite', onPress: () => {} },
    { label: 'Edit Account', onPress: () => {} },
    { label: 'Settings and Privacy', onPress: () => {} },
    { label: 'View Badges Earned', onPress: () => {} },
    { label: 'Help', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Account</Text>

        <View style={styles.avatarContainer}>
          <Image
            source={require('../../assets/male.png')}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editBadge}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Menu items */}
        {menu.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.row}
            onPress={item.onPress}
          >
            <Text style={styles.rowText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        ))}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Log out */}
        <TouchableOpacity style={styles.row} onPress={handleLogout}>
          <Text style={[styles.rowText, styles.logoutText]}>Log out</Text>
          <Ionicons name="chevron-forward" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 24,
    marginHorizontal: 24,
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
  row: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowText: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 8,
    marginHorizontal: 24,
  },
  logoutText: {
    color: '#FF3B30',
  },
});
