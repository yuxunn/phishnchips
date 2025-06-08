import { ThemedText } from '@/components/ThemedText';
import { lessons } from '@/data/learnContent';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

export default function BadgesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <ThemedText style={styles.title}>All Badges</ThemedText>
      {lessons.map(lesson => (
        <View key={lesson.id} style={styles.badgeItem}>
          <Image source={lesson.image} style={styles.badgeImage} />
          <ThemedText style={styles.badgeLabel}>{lesson.title}</ThemedText>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  contentContainer: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  badgeItem: {
    alignItems: 'center',
    marginBottom: 32,
  },
  badgeImage: {
    width: 96,
    height: 96,
    borderRadius: 20,
    marginBottom: 8,
  },
  badgeLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 