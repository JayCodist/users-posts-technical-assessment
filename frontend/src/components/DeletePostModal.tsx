import React from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { Post } from '../types';

interface DeletePostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeletePostModal: React.FC<DeletePostModalProps> = ({ 
  post, 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting 
}) => {
  if (!post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sure To Delete Post?" maxWidth="max-w-md">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          "{post.title}" will be permanently deleted. This action cannot be undone.
        </p>
        <div className="flex space-x-3 justify-center">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            loading={isDeleting}
            loadingText="Deleting..."
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(DeletePostModal);
