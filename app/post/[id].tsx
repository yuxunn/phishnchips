import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import POSTS from forum screen
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

// Mock comments data
const COMMENTS = {
  '1': [
    {
      id: '1',
      user: { name: 'Sarah Tan', avatar: '👩🏻' },
      content: 'Thanks for sharing! I received this too. The link definitely looks suspicious.',
      time: '04:35 pm',
      likes: 5,
    },
    {
      id: '2',
      user: { name: 'Alex Wong', avatar: '🧑🏻' },
      content: 'CPF will never send SMS with links. Always verify through official CPF website.',
      time: '04:40 pm',
      likes: 8,
    },
    {
      id: '3',
      user: { name: 'Michelle Lee', avatar: '👩🏻' },
      content: 'I reported this to the police. They confirmed it\'s a known scam.',
      time: '04:45 pm',
      likes: 12,
    },
    {
      id: '4',
      user: { name: 'David Chen', avatar: '🧑🏻' },
      content: 'Good catch! Everyone should be aware of these scams.',
      time: '04:50 pm',
      likes: 3,
    },
    {
      id: '5',
      user: { name: 'Emma Lim', avatar: '👩🏻' },
      content: 'I almost clicked the link. Thanks for the warning!',
      time: '04:55 pm',
      likes: 6,
    },
  ],
  '2': [
    {
      id: '1',
      user: { name: 'John Tan', avatar: '🧑🏻' },
      content: 'This happened to me too! The seller asked for OTP claiming it was for "verification".',
      time: '04:35 pm',
      likes: 4,
    },
    {
      id: '2',
      user: { name: 'Lisa Ng', avatar: '👩🏻' },
      content: 'Never share OTP with anyone, even if they claim to be from the platform.',
      time: '04:40 pm',
      likes: 7,
    },
  ],
  '3': [
    {
      id: '1',
      user: { name: 'Peter Wong', avatar: '🧑🏻' },
      content: 'You can use QR code scanners that check for malicious links before opening them.',
      time: '04:35 pm',
      likes: 9,
    },
    {
      id: '2',
      user: { name: 'Rachel Lee', avatar: '👩🏻' },
      content: 'If it seems too good to be true, it probably is. Better to be safe than sorry.',
      time: '04:40 pm',
      likes: 5,
    },
    {
      id: '3',
      user: { name: 'Tommy Chen', avatar: '🧑🏻' },
      content: 'I use Google Lens to scan QR codes - it shows the URL before opening.',
      time: '04:45 pm',
      likes: 3,
    },
  ],
  '4': [
    {
      id: '1',
      user: { name: 'Sophie Lim', avatar: '👩🏻' },
      content: 'These job scams are getting more sophisticated. Always verify the company.',
      time: '12:05 am',
      likes: 6,
    },
    {
      id: '2',
      user: { name: 'Kevin Tan', avatar: '🧑🏻' },
      content: 'I received a similar message. The company name was slightly different from the real one.',
      time: '12:10 am',
      likes: 4,
    },
    {
      id: '3',
      user: { name: 'Grace Wong', avatar: '👩🏻' },
      content: 'Report these to the police. They have a dedicated team for job scams.',
      time: '12:15 am',
      likes: 8,
    },
    {
      id: '4',
      user: { name: 'Daniel Lee', avatar: '🧑🏻' },
      content: 'Legitimate companies will never ask for payment to start work.',
      time: '12:20 am',
      likes: 5,
    },
    {
      id: '5',
      user: { name: 'Amanda Chen', avatar: '👩🏻' },
      content: 'Check the company\'s registration number on ACRA before proceeding.',
      time: '12:25 am',
      likes: 7,
    },
  ],
};

type Post = typeof POSTS[0];
type Comment = {
  id: string;
  user: { name: string; avatar: string };
  content: string;
  time: string;
  likes: number;
};

type ListItem = (Post & { isOriginalPost: true }) | Comment;

export default function PostDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(COMMENTS[id as keyof typeof COMMENTS] || []);

  // Find the post from the POSTS array in forum.tsx
  const post = POSTS.find((p: Post) => p.id === id);

  if (!post) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text>Post not found</Text>
      </View>
    );
  }

  const handleLikeComment = (commentId: string) => {
    setLikedComments(prev => {
      const newLikedComments = new Set(prev);
      if (newLikedComments.has(commentId)) {
        newLikedComments.delete(commentId);
      } else {
        newLikedComments.add(commentId);
      }
      return newLikedComments;
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      user: { name: 'Robert Tan', avatar: '🧑🏻' }, // In a real app, this would be the current user
      content: newComment.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase(),
      likes: 0,
    };

    setComments(prev => [newCommentObj, ...prev]);
    setNewComment('');
  };

  const listData: ListItem[] = [{ ...post, isOriginalPost: true }, ...comments];

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#232042" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
      </View>

      <FlatList
        data={listData}
        keyExtractor={item => 'isOriginalPost' in item ? `post-${item.id}` : `comment-${item.id}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.userInfo}>
              <Text style={styles.avatar}>{item.user.avatar}</Text>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{item.user.name}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
            
            {'isOriginalPost' in item ? (
              <>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.tagsContainer}>
                  {item.user.tags.map((tag: string, idx: number) => (
                    <View key={tag} style={[styles.tag, tag === 'Verified by official sources' && styles.verifiedTag]}>
                      <Text style={[styles.tagText, tag === 'Verified by official sources' && styles.verifiedTagText]}>{tag}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.content}>{item.content}</Text>
                <View style={styles.statsRow}>
                  <TouchableOpacity style={styles.likeButton}>
                    <MaterialIcons name="thumb-up-alt" size={16} color="#C7CAE6" />
                    <Text style={styles.statsText}>{item.stats.likes}</Text>
                    <MaterialIcons name="chat-bubble-outline" size={16} color="#C7CAE6" style={{ marginLeft: 12 }} />
                    <Text style={styles.statsText}>{item.stats.comments}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.commentContent}>{item.content}</Text>
                <TouchableOpacity 
                  style={styles.likeButton}
                  onPress={() => handleLikeComment(item.id)}
                >
                  <MaterialIcons 
                    name={likedComments.has(item.id) ? "thumb-up" : "thumb-up-alt"} 
                    size={16} 
                    color={likedComments.has(item.id) ? "#F6B940" : "#C7CAE6"} 
                  />
                  <Text style={[styles.statsText, likedComments.has(item.id) && styles.likedText]}>
                    {item.likes}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      />

      <View style={[styles.commentInputContainer, { paddingBottom: insets.bottom }]}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]} 
          onPress={handleAddComment}
          disabled={!newComment.trim()}
        >
          <MaterialIcons 
            name="send" 
            size={24} 
            color={newComment.trim() ? "#6A8DFF" : "#C7CAE6"} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EDFF',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232042',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    fontSize: 32,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#232042',
  },
  time: {
    fontSize: 12,
    color: '#B2B6C8',
    marginTop: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232042',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#F1F3FA',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
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
  content: {
    fontSize: 15,
    color: '#232042',
    lineHeight: 22,
    marginBottom: 12,
  },
  commentContent: {
    fontSize: 15,
    color: '#232042',
    lineHeight: 22,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 13,
    color: '#B2B6C8',
    marginLeft: 4,
    fontWeight: '600',
  },
  likedText: {
    color: '#F6B940',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E6EDFF',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 40,
    paddingBottom: 10,
    maxHeight: 40,
    fontSize: 15,
    color: '#232042',
  },
  sendButton: {
    position: 'absolute',
    right: 24,
    padding: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
}); 