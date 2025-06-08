import { ThemedText } from '@/components/ThemedText';
import { Lesson, lessons as lessonsData } from '@/data/learnContent';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function LearnScreen() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'popular' | 'saved'>('all');
    const [savedLessons, setSavedLessons] = useState<{[id: string]: boolean}>({});
    const [filteredLessons, setFilteredLessons] = useState<Lesson[]>(lessonsData);
    const router = useRouter();

    // Merge saved state into lessons
    const lessons: Lesson[] = lessonsData.map((lesson: Lesson) => ({ ...lesson, saved: savedLessons[lesson.id] ?? lesson.saved }));

    const handleSearch = () => {
        let filtered: Lesson[] = lessons;
        if (filter === 'popular') {
            filtered = filtered.filter((l: Lesson) => l.popular);
        } else if (filter === 'saved') {
            filtered = filtered.filter((l: Lesson) => l.saved);
        }
        const query = search.trim().toLowerCase();
        if (query) {
            filtered = filtered.filter((lesson: Lesson) => lesson.title.toLowerCase().includes(query));
        }
        setFilteredLessons(filtered);
    };

    const handleFilter = (type: 'all' | 'popular' | 'saved') => {
        setFilter(type);
        let filtered: Lesson[] = lessons;
        if (type === 'popular') {
            filtered = lessons.filter((l: Lesson) => l.popular);
        } else if (type === 'saved') {
            filtered = lessons.filter((l: Lesson) => l.saved);
        }
        const query = search.trim().toLowerCase();
        if (query) {
            filtered = filtered.filter((lesson: Lesson) => lesson.title.toLowerCase().includes(query));
        }
        setFilteredLessons(filtered);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Title */}
            <ThemedText style={styles.title}>Learn</ThemedText>

            {/* Search Bar */}
            <View style={styles.searchBar}>
                <TextInput
                    placeholder="Find Course"
                    placeholderTextColor="#B0B0C3"
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
                <TouchableOpacity onPress={handleSearch} style={styles.searchIconButton}>
                    <ThemedText style={styles.searchIcon}>🔍</ThemedText>
                </TouchableOpacity>
            </View>

            {/* Badges/Horizontal Lessons Section */}
            <View style={styles.badgesHeaderRow}>
                <ThemedText style={styles.badgesTitle}>Badges earned</ThemedText>
                <TouchableOpacity onPress={() => router.push('./learn/badges')}>
                    <ThemedText style={styles.viewAllBadges}>View all Badges</ThemedText>
                </TouchableOpacity>
            </View>
            <FlatList
                data={lessons}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                style={styles.badgesList}
                renderItem={({ item }) => (
                    <View style={styles.badgeItem}>
                        <Image source={item.image} style={styles.badgeImage} />
                        <ThemedText style={styles.badgeLabel}>{item.title}</ThemedText>
                    </View>
                )}
            />

            {/* Lessons Section */}
            <ThemedText style={styles.lessonsTitle}>Lessons</ThemedText>
            {/* Filter Tabs */}
            <View style={styles.filterTabsRow}>
                <TouchableOpacity onPress={() => handleFilter('all')} style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}>
                    <ThemedText style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>All</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFilter('popular')} style={[styles.filterTab, filter === 'popular' && styles.filterTabActive]}>
                    <ThemedText style={[styles.filterTabText, filter === 'popular' && styles.filterTabTextActive]}>Popular</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFilter('saved')} style={[styles.filterTab, filter === 'saved' && styles.filterTabActive]}>
                    <ThemedText style={[styles.filterTabText, filter === 'saved' && styles.filterTabTextActive]}>Saved</ThemedText>
                </TouchableOpacity>
            </View>

            {/* Lesson Cards */}
            {filteredLessons.map((lesson: Lesson) => (
                <View key={lesson.id} style={styles.lessonCard}>
                    <Image source={lesson.image} style={styles.lessonCardImage} />
                    <View style={styles.lessonCardContent}>
                        <ThemedText style={styles.lessonCardTitle}>{lesson.title}</ThemedText>
                        <View style={styles.lessonCardMetaRow}>
                            <ThemedText style={styles.lessonCardMeta}>⏱ {lesson.duration}</ThemedText>
                        </View>
                        <TouchableOpacity style={styles.lessonCardStartButton} onPress={() => router.push({ pathname: './learn/lesson', params: { id: lesson.id } })}>
                            <ThemedText style={styles.lessonCardStartButtonText}>Start</ThemedText>
                        </TouchableOpacity>
                    </View>
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
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    backgroundColor: 'transparent',
  },
  searchIconButton: {
    marginLeft: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: 18,
    color: '#B0B0C3',
  },
  badgesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  viewAllBadges: {
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  badgesList: {
    marginBottom: 24,
  },
  badgeItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  badgeImage: {
    width: 72,
    height: 72,
    borderRadius: 16,
    marginBottom: 4,
  },
  badgeLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  lessonsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterTabsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterTab: {
    backgroundColor: 'transparent',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginRight: 12,
  },
  filterTabActive: {
    backgroundColor: '#3B5BFE',
  },
  filterTabText: {
    color: '#B0B0C3',
    fontWeight: 'bold',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  lessonCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  lessonCardImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: 16,
  },
  lessonCardContent: {
    flex: 1,
  },
  lessonCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lessonCardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  lessonCardMeta: {
    color: '#B0B0C3',
    fontSize: 14,
  },
  lessonCardStartButton: {
    backgroundColor: '#3B5BFE',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
  },
  lessonCardStartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});