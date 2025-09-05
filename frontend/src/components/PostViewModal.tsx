import React from 'react';
import Modal from './ui/Modal';
import { Post } from '../types';

interface PostViewModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

const PostViewModal: React.FC<PostViewModalProps> = ({ post, isOpen, onClose }) => {
  if (!post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={post.title} maxWidth="max-w-2xl">
      <div className="prose max-w-none">
        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{post.body}</p>
        <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-400">
          {new Date(post.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(PostViewModal);
