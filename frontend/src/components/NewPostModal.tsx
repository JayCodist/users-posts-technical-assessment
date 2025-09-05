import React, { useState, useCallback } from "react";
import { useCreatePost } from "../hooks/useUsers";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import { useToast } from "../contexts/ToastContext";

interface NewPostModalProps {
  userId: string;
  onClose: () => void;
  isOpen: boolean;
}

const NewPostModal: React.FC<NewPostModalProps> = ({ userId, onClose, isOpen }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});
  const { showSuccess, showError } = useToast();

  const createPostMutation = useCreatePost();

  const validateForm = useCallback(() => {
    const newErrors: { title?: string; body?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Post title is required";
    }

    if (!body.trim()) {
      newErrors.body = "Post content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, body]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
      setTitle("");
      setBody("");
      setErrors({});
      showSuccess("Post created successfully!");
      onClose();
    } catch (error) {
      showError("Failed to create post. Please try again.");
      console.error("Failed to create post:", error);
    }
  }, [validateForm, createPostMutation, title, body, userId, showSuccess, showError, onClose]);

  const handleCancel = useCallback(() => {
    setTitle("");
    setBody("");
    setErrors({});
    onClose();
  }, [onClose]);

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
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
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
              errors.body ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={createPostMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={createPostMutation.isPending}
            loadingText="Publishing..."
          >
            Publish
          </Button>
        </div>

        {createPostMutation.isError && (
          <div className="mt-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">Failed to create post. Please try again.</p>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default React.memo(NewPostModal);
