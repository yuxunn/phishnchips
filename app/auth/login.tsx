import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const HEADER_HEIGHT = 200;
const OVERLAP = 40;

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Gradient header with single logo */}
      <LinearGradient
        colors={['#A1C4FD', '#C2E9FB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerContainer}
      >
        <Image
          source={require('../../assets/dsta-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </LinearGradient>

      {/* Body */}
      <View style={styles.bodyContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Welcome!</Text>

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordContainer}>
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

          <TouchableOpacity onPress={() => {/* TODO: forgot password */}}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            disabled={loading}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Logging in…' : 'Login'}
            </Text>
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Not a user? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={styles.registerLink}>Register now</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#DB4437' }]}>
              <FontAwesome name="google" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#4267B2' }]}>
              <FontAwesome name="facebook" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },

  headerContainer: {
    height: HEADER_HEIGHT,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 160,
    height: 60,
  },

  bodyContainer: {
    flex: 1,
    marginTop: -OVERLAP,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: OVERLAP,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    height: 50,
    backgroundColor: '#F5F6FA',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  passwordContainer: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#F5F6FA',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
  },

  passwordInput: {
    flex: 1,
  },

  forgot: {
    alignSelf: 'flex-end',
    color: '#2A5CFF',
    marginBottom: 16,
  },

  button: {
    height: 50,
    backgroundColor: '#2A5CFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },

  registerText: {
    color: '#888',
  },

  registerLink: {
    color: '#2A5CFF',
    fontWeight: '600',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },

  dividerText: {
    marginHorizontal: 12,
    color: '#888',
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    alignSelf: 'center',
  },

  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
