import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/dsta-logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Welcome!</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => {
        setIsLoggedIn(true);
        router.replace('/');
      }}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.bottomText}>
        Not a user?{' '}
        <Text style={styles.link} onPress={() => router.push('/auth/signup')}>Register now</Text>
      </Text>
      <Text style={styles.or}>Or continue with</Text>
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton}><Text style={styles.socialG}>G</Text></TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}><Text style={styles.socialF}>f</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 24 },
  logo: { width: 180, height: 80, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  input: { width: '100%', maxWidth: 340, height: 48, borderWidth: 1, borderColor: '#eee', borderRadius: 8, paddingHorizontal: 16, marginBottom: 12, backgroundColor: '#fafbfc' },
  forgot: { color: '#2a5cff', alignSelf: 'flex-end', marginBottom: 16, fontSize: 14 },
  button: { width: '100%', maxWidth: 340, backgroundColor: '#2a5cff', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  bottomText: { fontSize: 15, color: '#888', marginBottom: 12 },
  link: { color: '#2a5cff', fontWeight: 'bold' },
  or: { color: '#888', marginVertical: 8 },
  socialRow: { flexDirection: 'row', gap: 16 },
  socialButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f2f2f2', alignItems: 'center', justifyContent: 'center', marginHorizontal: 8 },
  socialG: { color: '#ea4335', fontWeight: 'bold', fontSize: 22 },
  socialF: { color: '#1877f3', fontWeight: 'bold', fontSize: 22 },
});
