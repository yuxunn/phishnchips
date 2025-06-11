import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { db } from '@/firebaseConfig';
import { arrayUnion, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '../../auth-context'; 

export default function PostDetailsScreen() {
  const { id, refreshPosts } = useLocalSearchParams(); 
  const { user } = useAuth(); 
  const router = useRouter();
  type Post = {
    id: string;
    title: string;
    content: string;
    comments?: { id: string; user: { name: string }; content: string }[];
    commentCount?: number;
  };

  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{ id: string; user: { name: string }; content: string }[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const postRef = doc(db, 'posts', Array.isArray(id) ? id[0] : id);
        const postSnapshot = await getDoc(postRef);
        if (postSnapshot.exists()) {
          const postData = postSnapshot.data();
          if (postData && 'title' in postData && 'content' in postData) {
            setPost({ id: postSnapshot.id, title: postData.title, content: postData.content, comments: postData.comments || [] });
            setComments(postData.comments || []);

          } else {
            console.error('Post data is incomplete');
          }
        } else {
          console.error('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);
  
  const handleAddComment = async () => {
    if (!newComment.trim()) return; 
  
    const comment = {
      id: Date.now().toString(),
      user: { name: user?.name || 'Anonymous User' },
      content: newComment.trim(),
    };
  
    try {
      const postRef = doc(db, 'posts', Array.isArray(id) ? id[0] : id);
  
      await updateDoc(postRef, {
        comments: arrayUnion(comment), 
        commentCount: increment(1), 
      });
  
      setComments((prev) => [...prev, comment]); 
      setPost((prev) => prev ? {
        ...prev,
        commentCount: (prev.commentCount || 0) + 1, 
      } : prev);
  
      setNewComment(''); 
  
      if (refreshPosts && typeof refreshPosts === 'function') {
        (refreshPosts as () => void)();
      }
      
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#6A8DFF" />
        </View>
      );
    }
  
    if (!post) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Post not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }
  
    return (
<View style={styles.container}>
  <View style={styles.card}>
    <Text style={styles.title}>{post.title}</Text>
    <Text style={styles.content}>{post.content}</Text>
  </View>

  <View style={styles.commentsSection}>
  <Text style={styles.commentsTitle}>Comments</Text>
  {comments.length > 0 ? (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.commentCard}>
          <Text style={styles.commentUser}>{item.user.name}</Text>
          <Text style={styles.commentContent}>{item.content}</Text>
        </View>
      )}
    />
  ) : (
    <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
  )}
</View>


  <View style={styles.commentInputContainer}>
    <TextInput
      style={styles.commentInput}
      placeholder="Add a comment..."
      value={newComment}
      onChangeText={setNewComment}
    />
    <TouchableOpacity
      style={styles.commentButton}
      onPress={handleAddComment}
    >
      <Text style={styles.commentButtonText}>Post</Text>
    </TouchableOpacity>
  </View>

  {/* Back Button */}
  <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
    <Text style={styles.backButtonText}>Go Back</Text>
  </TouchableOpacity>
</View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F7F8FA',
      padding: 16,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#232042',
      marginBottom: 8,
    },
    content: {
      fontSize: 16,
      color: '#232042',
      lineHeight: 22,
    },
    commentsSection: {
      marginTop: 16,
    },
    commentsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#232042',
      marginBottom: 12,
    },
    commentCard: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    commentUser: {
      fontWeight: 'bold',
      color: '#232042',
      marginBottom: 4,
    },
    commentContent: {
      color: '#232042',
      lineHeight: 20,
    },
    errorText: {
      fontSize: 18,
      color: '#FF6A6A',
      textAlign: 'center',
      marginBottom: 16,
    },
    backButton: {
      marginTop: 16,
      alignSelf: 'center',
      backgroundColor: '#6A8DFF',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    backButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    noCommentsText: {
      fontSize: 16,
      color: '#B2B6C8',
      textAlign: 'center',
      marginVertical: 8,
    },

commentInputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 16,
  backgroundColor: '#fff',
  borderRadius: 8,
  padding: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 1,
},
commentInput: {
  flex: 1,
  height: 40,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#E6EDFF',
  paddingHorizontal: 8,
  fontSize: 16,
  color: '#232042',
},
commentButton: {
  backgroundColor: '#6A8DFF',
  borderRadius: 8,
  paddingVertical: 8,
  paddingHorizontal: 16,
  marginLeft: 8,
},
commentButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
  });


