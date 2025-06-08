import { CreatePostForm } from '@/components/CreatePost';
import { POSTS, Post } from '@/data/posts';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function CreatePostScreen() {
  const router = useRouter();

  const currentUser = { name: 'Robert Tan' };

/*   const handleCreatePost = (postData: {
    title: string;
    content: string;
    tags: string[];
    anonymous: boolean;
  }) => {
    const newPost: Post = {
      id: String(Date.now()),
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
      comments: [],
    };

    POSTS.unshift(newPost); // Add to shared posts array (or call your API here)
    router.back(); // Go back to the forum screen after creating post
  };
 */

  const handleCreatePost = (post: Post) => {
    POSTS.unshift(post);
  };
  
  return (
    <View style={styles.container}>
      <CreatePostForm
  onPost={handleCreatePost}
  onClose={() => router.push('/forum')}
  currentUser={{
    name: 'Robert Tan',
    avatar: '🧑', // or a URL if you have  one
  }}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
});
