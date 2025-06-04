import styles from '../../components/Styles';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AccountScreen() {
    return (
        <ThemedView style={styles.centered}><ThemedText>Account Screen</ThemedText></ThemedView>
      );
}