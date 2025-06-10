import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_LESSONS_KEY = '@saved_lessons';

export const getSavedLessons = async (): Promise<{[id: string]: boolean}> => {
  try {
    const savedLessons = await AsyncStorage.getItem(SAVED_LESSONS_KEY);
    return savedLessons ? JSON.parse(savedLessons) : {};
  } catch (error) {
    console.error('Error getting saved lessons:', error);
    return {};
  }
};

export const setSavedLesson = async (lessonId: string, saved: boolean): Promise<void> => {
  try {
    const savedLessons = await getSavedLessons();
    savedLessons[lessonId] = saved;
    await AsyncStorage.setItem(SAVED_LESSONS_KEY, JSON.stringify(savedLessons));
  } catch (error) {
    console.error('Error saving lesson:', error);
  }
}; 