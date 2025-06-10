// This is a simple in-memory progress store. In a real app, use AsyncStorage or a backend.

export type LearnProgress = {
  [lessonId: string]: {
    [partId: string]: boolean; // true if completed
  };
};

let progress: LearnProgress = {};

export function getProgress(lessonId: string): { [partId: string]: boolean } {
  return progress[lessonId] || {};
}

export function setPartCompleted(lessonId: string, partId: string) {
  if (!progress[lessonId]) progress[lessonId] = {};
  progress[lessonId][partId] = true;
}

export function isPartCompleted(lessonId: string, partId: string): boolean {
  return !!(progress[lessonId] && progress[lessonId][partId]);
}

export function resetProgress() {
  progress = {};
}

export function isLessonCompleted(lessonId: string, totalParts: number): boolean {
  const progress = getProgress(lessonId);
  return Object.keys(progress).length === totalParts;
} 