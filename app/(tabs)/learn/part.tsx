import { ThemedText } from '@/components/ThemedText';
import { lessons } from '@/data/learnContent';
import { isPartCompleted, setPartCompleted } from '@/data/learnProgress';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function LessonPartScreen() {
  const { lessonId, partId } = useLocalSearchParams();
  const lesson = lessons.find(l => l.id === lessonId);
  const part = lesson?.parts.find(p => p.id === partId);
  const router = useRouter();
  const [completed, setCompleted] = useState(() => isPartCompleted(lessonId as string, partId as string));
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Reset completed state when part changes
    setCompleted(isPartCompleted(lessonId as string, partId as string));
  }, [lessonId, partId]);

  if (!lesson || !part) {
    return <ThemedText>Lesson part not found</ThemedText>;
  }

  const handleNext = () => {
    const currentIndex = lesson.parts.findIndex(p => p.id === partId);
    const nextPart = lesson.parts[currentIndex + 1];
    
    if (nextPart) {
      setPartCompleted(lesson.id, part.id);
      setCompleted(true);
      router.push({ pathname: '/learn/part', params: { lessonId, partId: nextPart.id } });
      // Scroll to top after navigation
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      }, 100);
    } else {
      // If it's the last part, go back to lesson page
      setPartCompleted(lesson.id, part.id);
      setCompleted(true);
      router.push({ pathname: '/learn/lesson', params: { id: lessonId } });
      //router.back();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        ref={scrollViewRef}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerBackButton}>
            <TouchableOpacity onPress={() => router.push({ pathname: '/learn/lesson', params: { id: lessonId } })} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#232042" />
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.headerTitle}>{part.title}</ThemedText>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.metaRow}>
            <ThemedText style={styles.duration}>{part.duration} mins</ThemedText>
            <ThemedText style={styles.lessonTitle}>{lesson.title}</ThemedText>
          </View>

          <ThemedText style={styles.description}>{part.description}</ThemedText>

          {/* Content Sections */}
          {part.content.sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
              <ThemedText style={styles.sectionContent}>{section.content}</ThemedText>
              {section.image && (
                <Image source={section.image} style={styles.sectionImage} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.navigationRow}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => {
            const currentIndex = lesson.parts.findIndex(p => p.id === partId);
            const prevPart = lesson.parts[currentIndex - 1];
            if (prevPart) {
              router.push({ pathname: '/learn/part', params: { lessonId, partId: prevPart.id } });
            }
          }}
          disabled={lesson.parts.findIndex(p => p.id === partId) === 0}
        >
          <MaterialIcons name="arrow-back" size={24} color="#232042" />
          <ThemedText style={styles.navButtonText}>Previous</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navButton, styles.nextButton, completed && styles.nextButtonDisabled]}
          onPress={handleNext}
          //disabled={completed}
        >
          <ThemedText style={styles.navButtonText}>
            {lesson.parts.findIndex(p => p.id === partId) === lesson.parts.length - 1 ? 'Complete' : 'Next'}
          </ThemedText>
          <MaterialIcons name="arrow-forward" size={24} color="#232042" />
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

  },
  headerBackButton: {
    margin: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    margin: 8,
    paddingBottom: 40,
    width: '80%'
  },
  headerImage: {
    width: 120,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  content: {
    backgroundColor: '#fff',

    marginTop: -32,
    padding: 24,
    minHeight: 400,
    marginBottom: 100,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  duration: {
    color: '#B0B0C3',
    fontSize: 16,
    marginRight: 16,
  },
  lessonTitle: {
    color: '#B0B0C3',
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    color: '#666',
  },
  section: {
    marginBottom: 32,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#232042',
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  sectionImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 16,
  },
  navigationRow: {
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
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F6F6F6',
  },
  nextButton: {
    marginLeft: 16,
    backgroundColor: '#3B5BFE',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  completeRow: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  completeButton: {
    backgroundColor: '#3B5BFE',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  completeButtonDone: {
    backgroundColor: '#B0B0C3',
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  nextButtonDisabled: {
    backgroundColor: '#B0B0C3',
  },
}); 