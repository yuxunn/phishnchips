import { Link, Redirect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function AuthIndex() {
  return (
<View style={styles.container}>
      <Text style={styles.title}>Welcome to Auth</Text>

      <Link href="/auth/login">
        <Text style={styles.link}>Login</Text>
      </Link>

      <Link href="/auth/signup">
        <Text style={styles.link}>Sign Up</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  link: { fontSize: 18, color: '#2a5cff', marginVertical: 8 },
});
