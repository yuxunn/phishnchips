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

type CreatePostFormProps = {
  onClose: () => void;
  onPost: (postData: {
    title: string;
    content: string;
    tags: string[];
    anonymous: boolean;
  }) => Promise<void>;
  currentUserName: string;
};

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ onClose, onPost, currentUserName }) => {
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
    if (selectedTags.length === 0) newErrors.tags = 'Select at least one tag';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  let isPosting = false;

  const handlePost = async () => {
    if (isPosting) {
      console.log('handlePost skipped because it is already posting.');
      return; // Prevent duplicate calls
    }
    isPosting = true;
  
    console.log('handlePost started');
    if (!validateForm()) {
      console.log('Form validation failed');
      isPosting = false;
      return;
    }
  
    try {
      await onPost?.({ title, content, tags: selectedTags, anonymous });
      console.log('onPost callback executed');
      onClose(); // Close the form after posting
    } catch (e) {
      console.error('Error saving post:', e);
    } finally {
      isPosting = false; // Reset flag
      console.log('handlePost finished');
    }
  };


  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Create Post</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
        }}
        style={{ borderBottomWidth: 1, marginBottom: 8 }}
      />
      {errors.title && <Text style={{ color: 'red' }}>{errors.title}</Text>}

      <TouchableOpacity onPress={() => setShowTagDropdown(true)}>
        <Text>Select tags</Text>
      </TouchableOpacity>
      {selectedTags.map((tag) => (
        <Text key={tag}>{tag}</Text>
      ))}
      {errors.tags && <Text style={{ color: 'red' }}>{errors.tags}</Text>}

      <Modal visible={showTagDropdown} transparent animationType="fade">
        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'center', backgroundColor: '#00000077' }}
          onPress={() => setShowTagDropdown(false)}
        >
          <View style={{ margin: 24, backgroundColor: '#fff', borderRadius: 6 }}>
            <FlatList
              data={AVAILABLE_TAGS.filter((tag) => !selectedTags.includes(tag))}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => addTag(item)} style={{ padding: 12 }}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <TextInput
        placeholder="Write your content..."
        value={content}
        onChangeText={(text) => {
          setContent(text);
          if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
        }}
        multiline
        numberOfLines={5}
        style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
      />
      {errors.content && <Text style={{ color: 'red' }}>{errors.content}</Text>}

      <TouchableOpacity onPress={() => setAnonymous(!anonymous)} style={{ marginBottom: 16 }}>
        <Text>{anonymous ? '✅ Anonymous' : '👤 Use my name'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePost} style={{ backgroundColor: '#6A8DFF', padding: 12 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Post</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onClose} style={{ marginTop: 12 }}>
        <Text style={{ textAlign: 'center', color: '#B2B6C8' }}>Cancel</Text>
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