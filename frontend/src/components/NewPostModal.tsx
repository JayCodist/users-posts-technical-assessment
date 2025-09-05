import React, { useState } from 'react';
import { useCreatePost } from '../hooks/useUsers';
import Modal from './ui/Modal';
import { useToast } from '../contexts/ToastContext';

interface NewPostModalProps {
  userId: string;
  onClose: () => void;
  isOpen: boolean;
}

const NewPostModal: React.FC<NewPostModalProps> = ({ userId, onClose, isOpen }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});
  const { showSuccess, showError } = useToast();
  
  const createPostMutation = useCreatePost();

  const validateForm = () => {
    const newErrors: { title?: string; body?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Post title is required';
    }
    
    if (!body.trim()) {
      newErrors.body = 'Post content is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        title: title.trim(),
        body: body.trim(),
        user_id: userId,
      });
      
      // Reset form and close modal
      setTitle('');
      setBody('');
      setErrors({});
      showSuccess('Post created successfully!');
      onClose();
    } catch (error) {
      showError('Failed to create post. Please try again.');
      console.error('Failed to create post:', error);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setBody('');
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="New Post" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Post title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My newest post"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
              Post content
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="I just wrote with every thought I have..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.body ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.body && (
              <p className="mt-1 text-sm text-red-600">{errors.body}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={createPostMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createPostMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
            >
              {createPostMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Publishing...
                </>
              ) : (
                'Publish'
              )}
            </button>
          </div>
          
          {createPostMutation.isError && (
            <div className="mt-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">
                  Failed to create post. Please try again.
                </p>
              </div>
            </div>
          )}
        </form>
    </Modal>
  );
};

export default NewPostModal;
