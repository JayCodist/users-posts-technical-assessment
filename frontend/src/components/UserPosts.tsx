import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser, useUserPosts, useDeletePost } from "../hooks/useUsers";
import { Post } from "../types";
import ErrorMessage from "./ui/ErrorMessage";
import NewPostModal from "./NewPostModal";
import Modal from "./ui/Modal";
import { useToast } from "../contexts/ToastContext";

const UserPosts: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const { showSuccess, showError } = useToast();

  const { data: user, isLoading: userLoading, error: userError } = useUser(userId || "");
  const { data: posts, isLoading: postsLoading, error: postsError, isError: postsIsError } = useUserPosts(userId || "");
  const deletePostMutation = useDeletePost();

  const isLoading = userLoading || postsLoading;
  const error = userError || postsError;
  const isError = !!userError || postsIsError;

  const handleBackToUsers = () => {
    // Use browser back if there's history, otherwise go to home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleDeletePost = (post: Post) => {
    setPostToDelete(post);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;

    try {
      await deletePostMutation.mutateAsync({ postId: postToDelete.id, userId: userId || "" });
      setPostToDelete(null);
      showSuccess("Post deleted successfully");
    } catch (error) {
      showError("Failed to delete post. Please try again.");
      console.error("Failed to delete post:", error);
    }
  };

  const cancelDeletePost = () => {
    setPostToDelete(null);
  };

  const handleNewPost = () => {
    setIsModalOpen(true);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleClosePostModal = () => {
    setSelectedPost(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col">
              <button onClick={handleBackToUsers} className="hover:bg-gray-100 rounded-md p-1 text-gray-500 transition-colors duration-150 self-start">
                ← Back to Users
              </button>
            </div>
          </div>
          <div className="p-20 flex justify-center items-center">
            <div className="lds-ellipsis">
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col">
              <button onClick={handleBackToUsers} className="hover:bg-gray-100 rounded-md p-1 text-gray-500 transition-colors duration-150 self-start">
                ← Back to Users
              </button>
            </div>
          </div>
          <div className="p-6">
            <ErrorMessage message={error?.message || "Failed to load posts"} onRetry={() => window.location.reload()} />
          </div>
        </div>
      </div>
    );
  }

  const postsArray = posts || [];

  return (
    <div className="container mx-auto px-32 py-8">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-1 flex-col justify-start">
            <button
              onClick={handleBackToUsers}
              className="hover:bg-gray-100 rounded-md p-1 text-gray-500 transition-colors duration-150 self-start"
            >
              ← Back to Users
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{user?.name || "User"}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {user?.email} • {postsArray.length} {postsArray.length === 1 ? "Post" : "Posts"}
              </p>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* New Post Card - Always first */}
            <div
              onClick={handleNewPost}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-150 min-h-[200px]"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">New Post</h3>
            </div>

            {/* Post Cards */}
            {postsArray.map((post: Post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post)}
                className="border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow duration-150 min-h-[200px] relative group"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">{post.body}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-400">
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePost(post);
                    }}
                    disabled={deletePostMutation.isPending}
                    className="absolute top-4 right-4 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-150 disabled:opacity-50"
                    title="Delete post"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      <NewPostModal userId={userId || ""} onClose={() => setIsModalOpen(false)} isOpen={isModalOpen} />

      {/* Post View Modal */}
      {selectedPost && (
        <Modal isOpen={true} onClose={handleClosePostModal} title={selectedPost.title} maxWidth="max-w-2xl">
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedPost.body}</p>
            <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-400">
              {new Date(selectedPost.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <Modal isOpen={true} onClose={cancelDeletePost} title="Sure To Delete Post?" maxWidth="max-w-md">
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
              "{postToDelete.title}" will be permanently deleted. This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={cancelDeletePost}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePost}
                disabled={deletePostMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletePostMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserPosts;
