import React, { useState, useMemo, useCallback, ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser, useUserPosts, useDeletePost } from "../hooks/useUsers";
import { Post } from "../types";
import ErrorMessage from "./ui/ErrorMessage";
import NewPostModal from "./NewPostModal";
import PostViewModal from "./PostViewModal";
import DeletePostModal from "./DeletePostModal";
import PostCard from "./PostCard";
import BackButton from "./ui/BackButton";
import LoadingIndicator from "./ui/LoadingIndicator";
import { useToast } from "../contexts/ToastContext";

// Local PageLayout component for UserPosts
interface PageLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showBackButton = true,
  onBackClick,
  className = "container mx-auto lg:px-32 px-4 py-8",
}) => {
  return (
    <div className={className}>
      <div className="bg-white rounded-lg shadow-sm">
        {showBackButton && onBackClick && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col">
              <BackButton title="Back to Users" onClick={onBackClick} />
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

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

  const handleBackToUsers = useCallback(() => {
    // Use browser back if there's history, otherwise go to home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleDeletePost = useCallback(
    (post: Post) => {
      setPostToDelete(post);
    },
    [setPostToDelete]
  );

  const confirmDeletePost = useCallback(async () => {
    if (!postToDelete) return;

    try {
      await deletePostMutation.mutateAsync({ postId: postToDelete.id, userId: userId || "" });
      setPostToDelete(null);
      showSuccess("Post deleted successfully");
    } catch (error) {
      showError("Failed to delete post. Please try again.");
      console.error("Failed to delete post:", error);
    }
  }, [postToDelete, deletePostMutation, userId, showSuccess, showError]);

  const cancelDeletePost = useCallback(() => {
    setPostToDelete(null);
  }, [setPostToDelete]);

  const handleNewPost = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);

  const handlePostClick = useCallback((post: Post) => {
    setSelectedPost(post);
  }, []);

  const handleClosePostModal = () => {
    setSelectedPost(null);
  };

  const postsArray = useMemo(() => posts || [], [posts]);

  if (isLoading) {
    return (
      <PageLayout onBackClick={handleBackToUsers} className="container mx-auto px-4 py-8">
        <div className="p-20 flex justify-center items-center">
          <LoadingIndicator />
        </div>
      </PageLayout>
    );
  }

  if (isError) {
    return (
      <PageLayout onBackClick={handleBackToUsers} className="container mx-auto px-4 py-8">
        <div className="p-6">
          <ErrorMessage message={error?.message || "Failed to load posts"} onRetry={() => window.location.reload()} />
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout showBackButton={false}>

        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-1 flex-col justify-start">
            <BackButton title="Back to Users" onClick={handleBackToUsers} />
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
              <PostCard
                key={post.id}
                post={post}
                onClick={handlePostClick}
                onDelete={handleDeletePost}
                isDeleting={deletePostMutation.isPending}
              />
            ))}
          </div>
        </div>
      </PageLayout>

      <NewPostModal userId={userId || ""} onClose={() => setIsModalOpen(false)} isOpen={isModalOpen} />

      <PostViewModal post={selectedPost} isOpen={!!selectedPost} onClose={handleClosePostModal} />

      <DeletePostModal
        post={postToDelete}
        isOpen={!!postToDelete}
        onClose={cancelDeletePost}
        onConfirm={confirmDeletePost}
        isDeleting={deletePostMutation.isPending}
      />
    </>
  );
};

export default React.memo(UserPosts);
