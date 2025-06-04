import styles from '@/components/Styles';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function LearnScreen() {
    return (
        <ThemedView style={styles.centered}><ThemedText>Learn Screen</ThemedText></ThemedView>
      );
}