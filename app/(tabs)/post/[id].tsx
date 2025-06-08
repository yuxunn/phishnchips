import { POSTS, Post } from '@/data/posts';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



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

  // Find the post from the shared POSTS array
  const post = POSTS.find((p: Post) => p.id === id);
  console.log(post);
  const [comments, setComments] = useState<Comment[]>(post?.comments || []);

  React.useEffect(() => {
    setComments(post?.comments || []);
  }, [post?.comments]);
  

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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 44}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/forum')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#232042" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
      </View>

      <KeyboardAwareFlatList
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
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={Platform.OS === 'ios' ? 120 : 44}
        keyboardShouldPersistTaps="handled"
      />

      <View style={[styles.commentInputContainer]}>
        <View style={styles.inputWrapper}>
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
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E6EDFF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    borderRadius: 20,
    paddingRight: 8,
  },
  commentInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 10,
    maxHeight: 40,
    fontSize: 15,
    color: '#232042',
  },
  sendButton: {
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
