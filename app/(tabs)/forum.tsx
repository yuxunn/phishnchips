import { CreatePostForm } from '@/components/CreatePost';
import { db } from '@/firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FILTERS = [
  { label: 'Latest', key: 'latest' },
  { label: 'Verified', key: 'verified' },
  { label: 'My posts', key: 'myposts' },
];

const NOTIFICATIONS = [
  { id: '1', icon: 'thumb-up', message: 'sarah_xxtan liked your comment', time: 'Just now', color: '#FFD6E3' },
  { id: '2', icon: 'chat-bubble', message: 'sgwinnabe replied to your comment: "L..."', time: 'Just now', color: '#E6EDFF' },
  { id: '3', icon: 'chat-bubble', message: 'antiscamher0 replied to your commen...', time: 'Just now', color: '#E6EDFF' },
];

export default function ForumScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [tab, setTab] = useState<'posts' | 'notifications'>('posts');
  const [selectedFilter, setSelectedFilter] = useState('latest');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser] = useState({ name: 'Robert Tan' });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const postsFromFirestore = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsFromFirestore);
    } catch (e) {
      console.error('Failed to fetch posts:', e);
    } finally {
      setLoading(false);
    }
  };

  const refreshPosts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'posts'));
      const postsFromFirestore = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsFromFirestore);
    } catch (error) {
      console.error('Error refreshing posts:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts(); 
    }, [])
  );
  let isPosting = false;

  const handleCreatePost = async (postData: {
    title: string;
    content: string;
    tags: string[];
    anonymous: boolean;
  }) => {
    if (isPosting) {
      console.log('handleCreatePost skipped because it is already posting.');
      return; // Prevent duplicate calls
    }
    isPosting = true;
  
    console.log('handleCreatePost started:', postData);
  
    const newPost = {
      user: {
        name: postData.anonymous ? 'Anonymous User' : currentUser.name,
        avatar: '🧑🏻',
        tags: postData.tags,
      },
      time: 'Just now',
      timestamp: serverTimestamp(),
      title: postData.title,
      content: postData.content,
      commentCount: 0, 
      stats: {
        likes: 0,
      },
    };
  
    try {
      await addDoc(collection(db, 'posts'), newPost);
      console.log('Post successfully created:', newPost);
      fetchPosts(); // Refresh posts
    } catch (e) {
      console.error('Error saving post to Firestore:', e);
    } finally {
      isPosting = false; // Reset flag
      console.log('handleCreatePost finished.');
    }
  };
const handleLike = async (postId: string) => {
  const isLiked = likedPosts.has(postId); 

  setLikedPosts(prev => {
    const newLikedPosts = new Set(prev);
    if (isLiked) newLikedPosts.delete(postId);
    else newLikedPosts.add(postId);
    return newLikedPosts;
  });

  try {
    await updateDoc(doc(db, 'posts', postId), {
      'stats.likes': increment(isLiked ? -1 : 1), 
    });
    fetchPosts();
  } catch (e) {
    console.error('Error updating likes:', e);
  }
};


  const filteredAndSortedPosts = React.useMemo(() => {
    let filtered = [...posts];

    if (selectedFilter === 'verified') {
      filtered = filtered.filter(post =>
        post.user.tags.includes('Verified by official sources')
      );
    }
    if (selectedFilter === 'myposts') {
      filtered = filtered.filter(post => post.user.name === currentUser.name);
    }

    return filtered;
  }, [posts, selectedFilter, currentUser.name]);

  if (showCreateForm) {
    return (
      <CreatePostForm
        onClose={() => setShowCreateForm(false)}
        onPost={handleCreatePost}
        currentUserName={currentUser.name}
      />
    );
  }


  return (
    <View style={[styles.container, { paddingTop: 32, paddingHorizontal: 16 }]}>
      <Text style={styles.title}>Forum</Text>
      <View style={styles.tabRow}>
        <TouchableOpacity onPress={() => setTab('posts')} style={styles.tabBtn}>
          <Text style={[styles.tabText, tab === 'posts' && styles.tabTextActive]}>Posts</Text>
          {tab === 'posts' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('notifications')} style={styles.tabBtn}>
          <Text style={[styles.tabText, tab === 'notifications' && styles.tabTextActive]}>Notifications</Text>
          {tab === 'notifications' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      {tab === 'posts' && (
        <>
          <View style={styles.filterRow}>
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterChip, selectedFilter === f.key && styles.filterChipActive]}
                onPress={() => setSelectedFilter(f.key)}
              >
                <Text style={[styles.filterChipText, selectedFilter === f.key && styles.filterChipTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.plusBtn} onPress={() => setShowCreateForm(true)}>
              <MaterialIcons name="add" size={22} color="#232042" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={filteredAndSortedPosts}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.postCard}
                  onPress={() => router.push(`/post/${item.id}`)}
                  >
                  <Text style={styles.postTitle}>{item.title}</Text>
                  <Text style={styles.commentCount}>{item.commentCount || 0} Comments</Text>
                  </TouchableOpacity>
              )}
            />
          )}
        </>
      )}

      {tab === 'notifications' && (
        <FlatList
          data={NOTIFICATIONS}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.notificationCard, { backgroundColor: item.color }]}>
              <MaterialIcons name={item.icon as any} size={24} color="#6A8DFF" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.notificationText}>{item.message}</Text>
                <Text style={styles.notificationTime}>{item.time}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#232042',
    marginTop: 8,
    marginBottom: 8,
    letterSpacing: -0.5,
    paddingHorizontal: 24,
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E6EDFF',
    marginBottom: 0,
    marginHorizontal: 0,
    paddingHorizontal: 24,
  },
  tabBtn: {
    marginRight: 32,
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 18,
    color: '#B2B6C8',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#232042',
  },
  tabUnderline: {
    height: 3,
    backgroundColor: '#6A8DFF',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6A6A',
    position: 'absolute',
    top: 6,
    right: -16,
  },
  filterRow: {
    flexGrow: 0,
    flexShrink: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  filterChip: {
    backgroundColor: '#F1F3FA',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 7,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: '#6A8DFF',
  },
  filterChipText: {
    color: '#232042',
    fontWeight: '600',
    fontSize: 10,
  },
  filterChipTextActive: {
    color: '#fff',
    fontSize: 10,
  },
  plusBtn: {
    backgroundColor: '#E6EDFF',
    borderRadius: 12,
    marginLeft: 8,
    padding: 2,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    fontSize: 32,
    marginRight: 4,
  },
  postTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#232042',
    marginBottom: 2,
  },
  tag: {
    backgroundColor: '#F1F3FA',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginRight: 6,
    marginTop: 2,
  },
  tagText: {
    fontSize: 11,
    color: '#63606C',
    fontWeight: '600',
  },
  verifiedTag: {
    backgroundColor: '#E6EDFF',
  },
  verifiedTagText: {
    color: '#3CB371',
  },
  time: {
    fontSize: 12,
    color: '#B2B6C8',
    marginLeft: 8,
    fontWeight: '500',
  },
  content: {
    fontSize: 14,
    color: '#232042',
    marginBottom: 10,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statsText: {
    fontSize: 13,
    color: '#B2B6C8',
    marginLeft: 2,
    fontWeight: '600',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  notificationText: {
    fontSize: 15,
    color: '#232042',
    fontWeight: '600',
  },
  notificationTime: {
    fontSize: 13,
    color: '#B2B6C8',
    marginTop: 2,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likedText: {
    color: '#F6B940',
  },
  commentCount: {
    fontSize: 12,
    color: '#63606C',
    marginTop: 4,
  },
});