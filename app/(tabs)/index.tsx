import ParallaxScrollView from '@/components/ParallaxScrollView';
import styles from '@/components/Styles';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, Platform, StatusBar, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
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
                style={styles.inputTransparent}
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
            <View key={`${idx}-${item.label}`} style={styles.progressItemRow}>
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
