import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../auth-context';

export default function SignupScreen() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <Text style={styles.subtitle}>Create an account to get started</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Create a password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.passwordReqs}>
        <Text style={styles.req}>• At least 12 characters</Text>
        <Text style={styles.req}>• At least 1 uppercase letter, 1 lowercase letter</Text>
        <Text style={styles.req}>• At least 1 digit (0-9)</Text>
        <Text style={styles.req}>• At least 1 special character</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <View style={styles.checkboxRow}>
        <TouchableOpacity onPress={() => setAgree(!agree)} style={styles.checkboxBox}>
          {agree && <View style={styles.checkboxTick} />}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>
          I've read and agree with the <Text style={styles.link}>Terms and Conditions</Text> and the <Text style={styles.link}>Privacy Policy</Text>.
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.button, !(agree && name && email && password && confirmPassword) && { opacity: 0.5 }]}
        disabled={!(agree && name && email && password && confirmPassword)}
        onPress={() => setIsLoggedIn(true)}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
      <Text style={styles.bottomText}>
        Already a user?{' '}
        <Text style={styles.link} onPress={() => router.push('/auth/login')}>Login now</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, alignSelf: 'flex-start' },
  subtitle: { fontSize: 15, color: '#888', marginBottom: 16, alignSelf: 'flex-start' },
  input: { width: '100%', maxWidth: 340, height: 48, borderWidth: 1, borderColor: '#eee', borderRadius: 8, paddingHorizontal: 16, marginBottom: 12, backgroundColor: '#fafbfc' },
  passwordReqs: { alignSelf: 'flex-start', marginBottom: 8 },
  req: { fontSize: 13, color: '#444' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, alignSelf: 'flex-start', maxWidth: 340 },
  checkboxBox: { width: 20, height: 20, borderWidth: 1, borderColor: '#2a5cff', borderRadius: 4, marginRight: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  checkboxTick: { width: 12, height: 12, backgroundColor: '#2a5cff', borderRadius: 2 },
  checkboxText: { fontSize: 13, color: '#444', flex: 1, flexWrap: 'wrap' },
  link: { color: '#2a5cff', fontWeight: 'bold' },
  button: { width: '100%', maxWidth: 340, backgroundColor: '#2a5cff', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  bottomText: { fontSize: 15, color: '#888', marginBottom: 12 },
});
