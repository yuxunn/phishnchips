import styles from '../../components/Styles';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ForumScreen() {
    return (
        <ThemedView style={styles.centered}><ThemedText>Forum Screen</ThemedText></ThemedView>
      );
}