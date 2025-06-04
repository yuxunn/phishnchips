import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, Platform, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

// Define the tab param list for type safety
export type TabParamList = {
  Home: undefined;
  Learn: undefined;
  Detect: undefined;
  Forum: undefined;
  Account: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function HomeScreen() {
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  const userName = 'Lucas';
  const progress = [
    { label: 'Fake News and Misinformation', value: 4, total: 5 },
    { label: 'Safe Social Media Practices', value: 6, total: 24 },
  ];
  const screenWidth = Dimensions.get('window').width;
  const horizontalPadding = 20;
  const headerHeight = 160;
  const overlap = 32;

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
      {/* Gradient Welcome Header */}
      <LinearGradient
        colors={["#6A8DFF", "#8F6AFF"]}
        style={[
          styles.gradientHeaderRefactored,
          {
            height: headerHeight,
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 32 : 48,
            paddingHorizontal: horizontalPadding,
          },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ThemedText type="title" style={styles.headerText}>
            Welcome back,{"\n"}{userName}
          </ThemedText>
        </View>
        <Image
          source={{ uri: 'https://ui-avatars.com/api/?name=Lucas&background=6A8DFF&color=fff' }}
          style={styles.avatar}
        />
      </LinearGradient>

      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={<View />}
      >
        {/* Saw a Scam Card - Overlapping the header */}
        <View style={{ alignItems: 'center', marginTop: -overlap, marginBottom: 18, zIndex: 2 }}>
          <ThemedView style={[styles.scamCardRefactored, { width: screenWidth - horizontalPadding * 2 }]}>
            <ThemedText type="subtitle" style={{ marginBottom: 2, fontSize: 18, fontWeight: '700' }}>Saw a Scam?</ThemedText>
            <ThemedText style={{ color: '#888', marginBottom: 8, fontSize: 15 }}>
              Protect your loved ones and report potential scams.
            </ThemedText>
            <View style={styles.inputWrapper}>
              <Ionicons name="pencil" size={20} color="#bbb" style={{ marginLeft: 8 }} />
              <TextInput
                placeholder="Write what happened..."
                placeholderTextColor="#bbb"
                style={styles.input}
              />
            </View>
          </ThemedView>
        </View>

        {/* Scam Alert Card + Placeholder Image */}
        <View style={[styles.alertRow, { paddingHorizontal: horizontalPadding, marginBottom: 18 }] }>
          <ThemedView style={styles.alertCard}>
            <ThemedText style={{ fontWeight: 'bold', fontSize: 15 }}>29 May</ThemedText>
            <ThemedText type="subtitle" style={{ fontSize: 16, marginTop: 2 }}>
              [SCAM ALERT] Phishing emails
            </ThemedText>
            <ThemedText style={{ marginTop: 2, fontSize: 14 }}>
              Email claiming to be from Singpass contains link to fake website phishing for user's email and password....
            </ThemedText>
            <TouchableOpacity style={styles.seeMoreBtn}>
              <ThemedText style={styles.seeMoreText}>See More</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          <ThemedView style={styles.alertCardPlaceholder}>
            <Ionicons name="image" size={48} color="#b3d6f7" />
          </ThemedView>
        </View>

        {/* Learning Progress */}
        <ThemedText type="subtitle" style={{ marginTop: 8, marginBottom: 8, marginLeft: horizontalPadding, fontSize: 18, fontWeight: '700' }}>Learning Progress</ThemedText>
        <ThemedView style={[styles.progressSection, { marginHorizontal: horizontalPadding, marginBottom: 18 }] }>
          {progress.map((item, idx) => (
            <View key={item.label} style={styles.progressItemRow}>
              <View style={styles.progressItemLeft}>
                <View style={styles.circleProgress}>
                  <View style={{
                    ...styles.circleFill,
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    borderColor: '#6A8DFF',
                    borderWidth: 4,
                    borderRightColor: '#eee',
                    transform: [{ rotate: `${(item.value / item.total) * 360}deg` }],
                  }} />
                </View>
                <ThemedText style={styles.progressLabel}>{item.label}</ThemedText>
              </View>
              <ThemedText style={styles.progressValueRight}>{item.value}/{item.total}</ThemedText>
            </View>
          ))}
        </ThemedView>

        {/* Shortcuts */}
        <ThemedView style={[styles.shortcutsCard, { marginHorizontal: horizontalPadding, marginBottom: 32 }] }>
          <ThemedText type="subtitle" style={{ marginBottom: 8, fontSize: 18, fontWeight: '700' }}>Shortcuts</ThemedText>
          <View style={styles.shortcutsRowAligned}>
            <View style={styles.shortcutIconWrapAligned}>
              <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/SGSecure_logo.png' }} style={styles.shortcutIconAligned} />
              <ThemedText style={styles.shortcutLabel}>SGSecure</ThemedText>
            </View>
            <View style={styles.shortcutIconWrapAligned}>
              <Ionicons name="shield" size={48} color="#6A8DFF" style={styles.shortcutIconAligned} />
              <ThemedText style={styles.shortcutLabel}>ScamShield</ThemedText>
            </View>
            <View style={styles.shortcutIconWrapAligned}>
              <Ionicons name="people" size={48} color="#6A8DFF" style={styles.shortcutIconAligned} />
            </View>
          </View>
        </ThemedView>
      </ParallaxScrollView>
    </View>
  );
}

function LearnScreen() {
  return (
    <ThemedView style={styles.centered}><ThemedText>Learn Screen</ThemedText></ThemedView>
  );
}

function DetectScreen() {
  return (
    <ThemedView style={styles.centered}><ThemedText>Detect Screen</ThemedText></ThemedView>
  );
}

function ForumScreen() {
  return (
    <ThemedView style={styles.centered}><ThemedText>Forum Screen</ThemedText></ThemedView>
  );
}

function AccountScreen() {
  return (
    <ThemedView style={styles.centered}><ThemedText>Account Screen</ThemedText></ThemedView>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name="home" size={size} color={color} />;
          } else if (route.name === 'Learn') {
            return <MaterialCommunityIcons name="book-open-variant" size={size} color={color} />;
          } else if (route.name === 'Detect') {
            return <FontAwesome5 name="qrcode" size={size} color={color} />;
          } else if (route.name === 'Forum') {
            return <Ionicons name="chatbubbles" size={size} color={color} />;
          } else if (route.name === 'Account') {
            return <Ionicons name="person" size={size} color={color} />;
          }
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Detect" component={DetectScreen} />
      <Tab.Screen name="Forum" component={ForumScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  gradientHeaderRefactored: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1,
  },
  headerText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginLeft: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  scamCardRefactored: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginLeft: 8,
    color: '#222',
  },
  alertRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  alertCard: {
    flex: 2,
    backgroundColor: '#d6f0ff',
    borderRadius: 16,
    padding: 16,
    marginRight: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  alertCardPlaceholder: {
    flex: 1,
    backgroundColor: '#e6f0fa',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    minHeight: 120,
  },
  seeMoreBtn: {
    marginTop: 12,
    backgroundColor: '#FF7A2F',
    borderRadius: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  seeMoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  progressSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'column',
    gap: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  progressItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  circleProgress: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    position: 'relative',
  },
  circleFill: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: '#6A8DFF',
    borderRadius: 20,
  },
  progressLabel: {
    fontSize: 16,
    color: '#222',
    flex: 1,
  },
  progressValueRight: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#6A8DFF',
    minWidth: 48,
    textAlign: 'right',
  },
  shortcutsCard: {
    backgroundColor: '#ede3ff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  shortcutsRowAligned: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 0,
  },
  shortcutIconWrapAligned: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  shortcutIconAligned: {
    width: 48,
    height: 48,
    marginBottom: 4,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  shortcutLabel: {
    fontSize: 13,
    color: '#222',
    marginTop: 2,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 