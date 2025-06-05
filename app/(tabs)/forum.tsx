import { CreatePostForm } from '@/components/CreatePost';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FILTERS = [
  { label: 'Latest', key: 'latest' },
  { label: 'Verified', key: 'verified' },
  { label: 'My posts', key: 'myposts' },
];

const POSTS = [
  {
    id: '1',
    user: { name: 'Robert Tan', avatar: '🧑🏻', tags: ['Phishing', 'CPFScam', 'Verified by official sources'] },
    time: '04:32 pm',
    timestamp: new Date('2024-03-20T16:32:00').getTime(),
    title: '‼️ Fake CPF Refund SMS circulating again',
    content: 'Received this message claiming CPF refund due to system update. Link looks fishy. (cpf-update[.]xyz). Be careful – official CPF will never text clickable links.',
    stats: { likes: 120, comments: 10 },
  },
  {
    id: '2',
    user: { name: 'Janessa Ng', avatar: '👩🏻', tags: ['Ecommerce'] },
    time: '04:31 pm',
    timestamp: new Date('2024-03-20T16:31:00').getTime(),
    title: 'Fake Carousell Seller Asking for bank OTP',
    content: 'Almost got scammed. Seller ask me to "verify payment" by giving my OTP after clicking a link. Carousell CS confirmed its a scam method. Beware of seller ABC.',
    stats: { likes: 89, comments: 7 },
  },
  {
    id: '3',
    user: { name: 'James Tan', avatar: '🧑🏻', tags: ['AskTheCommunity'] },
    time: '04:31 pm',
    timestamp: new Date('2024-03-20T16:31:00').getTime(),
    title: 'How to verify if a QR code is safe to scan?',
    content: 'Saw a poster with a QR code for "free gifts" at the MRT station. How can I check whether its safe before scanning?',
    stats: { likes: 70, comments: 3 },
  },
  {
    id: '4',
    user: { name: 'Emily Lai', avatar: '👩🏻', tags: ['JobScam', 'Telegram'] },
    time: '12:00 am',
    timestamp: new Date('2024-03-20T00:00:00').getTime(),
    title: 'Job Scam: Part time packing',
    content: 'Congratulations, you have completed your registration! Let\'s start your learning journey next…',
    stats: { likes: 70, comments: 5 },
  },
];

const NOTIFICATIONS = [
  { id: '1', icon: 'thumb-up', message: 'sarah_xxtan liked your comment', time: 'Just now', color: '#FFD6E3' },
  { id: '2', icon: 'chat-bubble', message: 'sgwinnabe replied to your comment: "L..."', time: 'Just now', color: '#E6EDFF' },
  { id: '3', icon: 'chat-bubble', message: 'antiscamher0 replied to your commen...', time: 'Just now', color: '#E6EDFF' },
];


export default function ForumScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [tab, setTab] = useState<'posts' | 'notifications'>('posts');
  const [selectedFilter, setSelectedFilter] = useState('latest');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [posts, setPosts] = useState(POSTS);
  
  // Add current user state - in a real app, this would come from your auth system
  const [currentUser] = useState({ name: 'Robert Tan' });

  const handleCreatePost = (postData: {
    title: string;
    content: string;
    tags: string[];
    anonymous: boolean;
  }) => {
    const newPost = {
      id: String(posts.length + 1),
      user: {
        name: postData.anonymous ? 'Anonymous User' : currentUser.name,
        avatar: '🧑🏻',
        tags: postData.tags,
      },
      time: 'Just now',
      timestamp: Date.now(),
      title: postData.title,
      content: postData.content,
      stats: { likes: 0, comments: 0 },
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const filteredAndSortedPosts = React.useMemo(() => {
    let filtered = [...posts];
    
    if (selectedFilter === 'verified') {
      filtered = filtered.filter(post => 
        post.user.tags.includes('Verified by official sources')
      );
    }
    
    if (selectedFilter === 'myposts') {
      filtered = filtered.filter(post => 
        post.user.name === currentUser.name
      );
    }
    
    if (selectedFilter === 'latest') {
      filtered.sort((a, b) => b.timestamp - a.timestamp);
    }
    
    return filtered;
  }, [posts, selectedFilter, currentUser.name]);

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newLikedPosts = new Set(prev);
      if (newLikedPosts.has(postId)) {
        newLikedPosts.delete(postId);
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, stats: { ...post.stats, likes: post.stats.likes - 1 } }
              : post
          )
        );
      } else {
        newLikedPosts.add(postId);
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, stats: { ...post.stats, likes: post.stats.likes + 1 } }
              : post
          )
        );
      }
      return newLikedPosts;
    });
  };

  if (showCreateForm) {
    return <CreatePostForm onClose={() => setShowCreateForm(false)} onPost={handleCreatePost} />;
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
          <View style={styles.dot} />
          {tab === 'notifications' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>
      {tab === 'posts' && (
        <>
          <View style={styles.filterRow}>
            {FILTERS.slice(0, 2).map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterChip, selectedFilter === f.key && styles.filterChipActive]}
                onPress={() => setSelectedFilter(f.key)}
              >
                <Text style={[styles.filterChipText, selectedFilter === f.key && styles.filterChipTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={[styles.filterChip, selectedFilter === 'myposts' && styles.filterChipActive]}
                onPress={() => setSelectedFilter('myposts')}
              >
                <Text style={[styles.filterChipText, selectedFilter === 'myposts' && styles.filterChipTextActive]}>My posts</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.plusBtn}
                onPress={() => setShowCreateForm(true)}
              >
                <MaterialIcons name="add" size={22} color="#232042" />
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={filteredAndSortedPosts}
            keyExtractor={item => item.id}
            style={{ marginTop: 8 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.postCard}
                onPress={() => router.push(`/post/${item.id}`)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={styles.avatar}>{item.user.avatar}</Text>
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={styles.postTitle}>{item.title}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 }}>
                      {item.user.tags.map((tag, idx) => (
                        <View key={tag} style={[styles.tag, tag === 'Verified by official sources' && styles.verifiedTag]}>
                          <Text style={[styles.tagText, tag === 'Verified by official sources' && styles.verifiedTagText]}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={styles.content}>{item.content}</Text>
                <View style={styles.statsRow}>
                  <TouchableOpacity 
                    onPress={(e) => {
                      e.stopPropagation();
                      handleLike(item.id);
                    }} 
                    style={styles.likeButton}
                  >
                    <MaterialIcons 
                      name={likedPosts.has(item.id) ? "thumb-up" : "thumb-up-alt"} 
                      size={16} 
                      color={likedPosts.has(item.id) ? "#F6B940" : "#C7CAE6"} 
                    />
                    <Text style={[styles.statsText, likedPosts.has(item.id) && styles.likedText]}>
                      {item.stats.likes}
                    </Text>
                    <MaterialIcons name="chat-bubble-outline" size={16} color="#C7CAE6" style={{ marginLeft: 12 }} />
                    <Text style={styles.statsText}>{item.stats.comments}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}
      {tab === 'notifications' && (
        <FlatList
          data={NOTIFICATIONS}
          keyExtractor={item => item.id}
          style={{ marginTop: 16 }}
          renderItem={({ item }) => (
            <View style={[styles.notificationCard, { backgroundColor: item.color }]}> 
              <MaterialIcons name={item.icon as any} size={24} color="#6A8DFF" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text 
                  style={styles.notificationText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.message}
                </Text>
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
});
