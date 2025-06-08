import { ThemedText } from '@/components/ThemedText';
import { lessons } from '@/data/learnContent';
import { getProgress, isPartCompleted } from '@/data/learnProgress';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams();
  const lesson = lessons.find(l => l.id === id);
  const [saved, setSaved] = useState(lesson?.saved ?? false);
  const [expandedPart, setExpandedPart] = useState<string | null>(null);
  const [progress, setProgress] = useState(() => getProgress(id as string));
  const router = useRouter();

  if (!lesson) {
    return <ThemedText>Lesson not found</ThemedText>;
  }

  // Helper to check if a part is unlocked (all previous parts completed)
  const isUnlocked = (idx: number) => {
    if (idx === 0) return true;
    const prevParts = lesson.parts.slice(0, idx);
    return prevParts.every(p => isPartCompleted(lesson.id, p.id));
  };

  const handleStartLesson = () => {
    const firstUnlockedPart = lesson.parts.find((part, idx) => isUnlocked(idx));
    if (firstUnlockedPart) {
      router.push({ pathname: '/learn/part', params: { lessonId: lesson.id, partId: firstUnlockedPart.id } });
    }
  };

  const handlePlayPart = (partId: string, idx: number) => {
    if (isUnlocked(idx)) {
      router.push({ pathname: '/learn/part', params: { lessonId: lesson.id, partId } });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header with image and title */}
        <View style={styles.header}>
          <View style={styles.headerBackButton}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#232042" />
            </TouchableOpacity>
          </View>

          {/* Popular tag */}
          {lesson.popular && (
            <View style={styles.popularTag}>
              <ThemedText style={styles.popularTagText}>Popular</ThemedText>
            </View>
          )}
          <ThemedText style={styles.headerTitle}>{lesson.title}</ThemedText>
          <Image source={lesson.image} style={styles.headerImage} />
        </View>

        {/* Lesson details */}
        <View style={styles.detailsCard}>
          <ThemedText style={styles.lessonTitle}>{lesson.title}</ThemedText>
          <ThemedText style={styles.lessonMeta}>{lesson.duration} · {lesson.parts.length} parts</ThemedText>
          <ThemedText style={styles.aboutTitle}>About this lesson</ThemedText>
          <ThemedText style={styles.lessonDescription}>{lesson.description}</ThemedText>
          
          {/* Parts list */}
          {lesson.parts.map((part, idx) => {
            const unlocked = isUnlocked(idx);
            const completed = isPartCompleted(lesson.id, part.id);
            return (
              <View key={part.id} style={styles.partRow}>
                <ThemedText style={styles.partIndex}>{String(idx + 1).padStart(2, '0')}</ThemedText>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity onPress={() => setExpandedPart(expandedPart === part.id ? null : part.id)}>
                    <ThemedText style={styles.partTitle}>{part.title}</ThemedText>
                    <View style={styles.partMetaRow}>
                      <ThemedText style={[styles.partDuration, completed && styles.partDurationCompleted]}>{part.duration} mins</ThemedText>
                      {completed && <ThemedText style={styles.partCompletedIcon}>✔️</ThemedText>}
                    </View>
                    {expandedPart === part.id && (
                      <ThemedText style={styles.partDescription}>
                        {part.description || `In this part, you'll learn about ${part.title.toLowerCase()}. This section will take approximately ${part.duration} minutes to complete.`}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                </View>
                {unlocked ? (
                  <TouchableOpacity 
                    style={styles.partPlayButton}
                    onPress={() => handlePlayPart(part.id, idx)}
                  >
                    <ThemedText style={styles.partPlayIcon}>▶️</ThemedText>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.partLockButton}>
                    <ThemedText style={styles.partLockIcon}>🔒</ThemedText>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Save and Start buttons - Fixed at bottom */}
      <View style={styles.saveStartRow}>
        <TouchableOpacity onPress={() => setSaved(s => !s)} style={[styles.saveButton, saved && styles.saveButtonActive]}>
          <ThemedText style={styles.saveButtonIcon}>{saved ? '★' : '☆'}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.startButton} onPress={handleStartLesson}>
          <ThemedText style={styles.startButtonText}>Start</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FEEFF6',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    padding: 24,
    alignItems: 'flex-start',
    position: 'relative',
    height: '40%',
  },
  headerBackButton: {
    margin: 8,
  },
  backButton: {
    padding: 8,
  },
  popularTag: {
    backgroundColor: '#FFD600',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    margin: 12,
    marginTop: 24,
    marginBottom: 24
  },
  popularTagText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    margin: 8,
    paddingBottom: 40,
    width: '60%'
  },
  headerImage: {
    width: 180,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 32,
    marginTop: -32,
    padding: 24,
    minHeight: 400,
    marginBottom: 100, // Add space for the fixed bottom buttons
  },
  lessonTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lessonMeta: {
    color: '#B0B0C3',
    fontSize: 16,
    marginBottom: 8,
  },
  aboutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  lessonDescription: {
    color: '#B0B0C3',
    marginBottom: 12,
  },
  partRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingVertical: 8,
  },
  partIndex: {
    fontSize: 24,
    color: '#B0B0C3',
    width: 36,
  },
  partTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  partDescription: {
    color: '#B0B0C3',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  partMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partDuration: {
    color: '#B0B0C3',
    fontWeight: 'bold',
    fontSize: 14,
  },
  partDurationCompleted: {
    color: '#3B5BFE',
  },
  partCompletedIcon: {
    color: '#3B5BFE',
    marginLeft: 4,
  },
  partPlayButton: {
    backgroundColor: '#3B5BFE',
    borderRadius: 24,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partPlayIcon: {
    color: '#fff',
    fontSize: 22,
  },
  partLockButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 24,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partLockIcon: {
    color: '#B0B0C3',
    fontSize: 22,
  },
  saveStartRow: {
    flexDirection: 'row',
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  saveButton: {
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
  },
  saveButtonActive: {
    backgroundColor: '#FFE6F0',
  },
  saveButtonIcon: {
    color: '#FF7A00',
    fontSize: 24,
  },
  startButton: {
    flex: 1,
    backgroundColor: '#3B5BFE',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 