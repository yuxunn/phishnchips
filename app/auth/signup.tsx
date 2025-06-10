import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useAuth } from '../../auth-context';

export default function SignupScreen() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (password !== confirm) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!agree) {
      Alert.alert('Error', 'You must accept the Terms and Privacy Policy');
      return;
    }
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });      
      setIsLoggedIn(true);
      router.replace('/(tabs)'); 
    } catch (err: any) {
      Alert.alert('Signup Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <View style={styles.passwordRow}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPwd}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPwd(v => !v)}>
          <Ionicons name={showPwd ? 'eye-off' : 'eye'} size={20} color="#888" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />
      <View style={styles.checkboxRow}>
        <TouchableOpacity
          style={[styles.checkboxBox, agree && styles.checkboxChecked]}
          onPress={() => setAgree(v => !v)}
        >
          {agree && <View style={styles.checkboxTick} />}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>
          I agree to the{' '}
          <Text style={styles.link}>Terms & Conditions</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>.
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.button, (!agree || loading) && { opacity: 0.6 }]}
        disabled={!agree || loading}
        onPress={handleSignup}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Signing up…' : 'Sign up'}
        </Text>
      </TouchableOpacity>
      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.loginLink}>Log in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FAFBFC',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    height: 48,
    backgroundColor: '#FAFBFC',
  },
  passwordInput: { flex: 1 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#2A5CFF',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#2A5CFF' },
  checkboxTick: { width: 12, height: 12, backgroundColor: '#FFF' },
  checkboxText: { flex: 1, fontSize: 13, color: '#444' },
  link: { color: '#2A5CFF', fontWeight: '600' },
  button: {
    height: 50,
    backgroundColor: '#2A5CFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: '#888' },
  loginLink: { color: '#2A5CFF', fontWeight: '600' },
});
