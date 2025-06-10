import { ThemedText } from '@/components/ThemedText';
import { lessons } from '@/data/learnContent';
import { isLessonCompleted } from '@/data/learnProgress';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

export default function BadgesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <ThemedText style={styles.title}>Badges Earned</ThemedText>
      {lessons.map(lesson => {
        const isCompleted = isLessonCompleted(lesson.id, lesson.parts.length);
        if (!isCompleted) return null;
        
        return (
          <View key={lesson.id} style={styles.badgeItem}>
            <Image source={lesson.image} style={styles.badgeImage} />
            <ThemedText style={styles.badgeLabel}>{lesson.title}</ThemedText>
          </View>
        );
      })}
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
    fontSize: 24,
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