import { Post } from '@/data/posts'; // adjust import path to your Post type
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type CreatePostFormProps = {
  onClose: () => void;
  onPost?: (post: Post) => void;
  currentUser?: {
    name: string;
    avatar: string;
  };
};

const AVAILABLE_TAGS = [
  'Seeking Advice',
  'Experience',
  'Tip Sharing',
  'Scam Alert',
  'Phishing',
  'Job Scam',
  'Investment Scam',
  'Social Media Scam',
];

export function CreatePostForm({ onClose, onPost, currentUser }: CreatePostFormProps) {
  const [title, setTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [content, setContent] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    tags?: string;
  }>({});

  const removeTag = (tag: string) =>
    setSelectedTags(selectedTags.filter((t) => t !== tag));

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setShowTagDropdown(false);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!content.trim()) newErrors.content = 'Content is required';
    if (selectedTags.length === 0) newErrors.tags = 'Please select at least one tag';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePost = () => {
    if (!validateForm()) return;

    const newPost: Post = {
      id: Math.random().toString(36).substring(2, 10),
      user: {
        name: anonymous ? 'Anonymous' : currentUser?.name ?? 'Guest',
        avatar: anonymous ? '👤' : currentUser?.avatar ?? '🧑',
        tags: selectedTags,
      },

      //tags: selectedTags,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      title,
      content,

      stats: {
        likes: 0,
        comments: 0,
      },
      comments: []
    };
    onPost?.(newPost);
    onClose();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <Text style={styles.heading}>Forum</Text>
      <Text style={styles.subheading}>Create new post</Text>

      <TextInput
        style={[styles.input, errors.title && styles.inputError]}
        placeholder="Title"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
        }}
        placeholderTextColor="#B2B6C8"
      />
      {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

      <Text style={styles.label}>Tags</Text>
      <TouchableOpacity
        style={[styles.tagInput, errors.tags && styles.inputError]}
        onPress={() => setShowTagDropdown(true)}
      >
        <Text style={styles.tagInputText}>Select tags</Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#B2B6C8" style={styles.tagIcon} />
      </TouchableOpacity>

      <View style={styles.tagContainer}>
        {selectedTags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
            <TouchableOpacity onPress={() => removeTag(tag)}>
              <MaterialIcons name="close" size={16} color="#B2B6C8" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      {errors.tags && <Text style={styles.errorTextTag}>{errors.tags}</Text>}

      <Modal
        visible={showTagDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTagDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTagDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            <FlatList
              data={AVAILABLE_TAGS.filter((tag) => !selectedTags.includes(tag))}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.dropdownItem} onPress={() => addTag(item)}>
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Text style={styles.label}>Content (max. 300 characters)</Text>
      <TextInput
        style={[styles.textarea, errors.content && styles.inputError]}
        placeholder="Write your content..."
        value={content}
        onChangeText={(text) => {
          setContent(text);
          if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
        }}
        maxLength={300}
        multiline
        numberOfLines={8}
        placeholderTextColor="#B2B6C8"
      />
      {errors.content && <Text style={styles.errorText}>{errors.content}</Text>}

      <View style={styles.anonymousBox}>
        <TouchableOpacity onPress={() => setAnonymous(!anonymous)} style={styles.checkboxWrapper}>
          <View style={[styles.checkbox, anonymous && { backgroundColor: '#6A8DFF' }]}>
            {anonymous && <MaterialIcons name="check" size={16} color="#fff" />}
          </View>
        </TouchableOpacity>
        <Text style={styles.anonymousText}>
          I wish to remain anonymous.{' '}
          <Text style={styles.noteText}>
            Do note that this might reduce post credibility. Users are encouraged to display name for forum posts.
          </Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.postButton} onPress={handlePost}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 48,
    paddingHorizontal: 32,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#232042',
    marginBottom: 12,
  },
  subheading: {
    fontSize: 22,
    fontWeight: '500',
    color: '#232042',
    marginBottom: 18,
  },
  input: {
    height: 44,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E6EDFF',
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 16,
    fontSize: 17,
    marginBottom: 18,
    color: '#232042',
  },
  label: {
    fontSize: 18,
    color: '#232042',
    fontWeight: '500',
    marginBottom: 8,
  },
  tagInput: {
    height: 40,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E6EDFF',
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#232042',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagInputText: {
    color: '#B2B6C8',
  },
  tagIcon: {
    marginLeft: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginBottom: 18,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3FA',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#232042',
    fontWeight: '600',
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '80%',
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EDFF',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#232042',
  },
  textarea: {
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E6EDFF',
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 16,
    paddingTop: 16,
    fontSize: 16,
    color: '#232042',
    minHeight: 120,
    marginBottom: 18,
    textAlignVertical: 'top',
  },
  anonymousBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  checkboxWrapper: {
    marginRight: 10,
    marginTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#B2B6C8',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  anonymousText: {
    flex: 1,
    color: '#232042',
    fontSize: 15,
    fontWeight: '500',
  },
  noteText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '400',
  },
  postButton: {
    backgroundColor: '#6A8DFF',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  cancelButtonText: {
    color: '#6A8DFF',
    fontSize: 16,
    fontWeight: '600',
  },
  inputError: {
    borderColor: '#FF6A6A',
  },
  errorText: {
    color: '#FF6A6A',
    fontSize: 12,
    marginTop: -14,
    marginBottom: 14,
    marginLeft: 4,
  },
  errorTextTag: {
    color: '#FF6A6A',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 14,
    marginLeft: 4,
  },
});
