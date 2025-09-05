import React from 'react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
  onDelete: (post: Post) => void;
  isDeleting?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick, onDelete, isDeleting = false }) => {
  const handleClick = () => {
    onClick(post);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(post);
  };

  return (
    <div
      onClick={handleClick}
      className="border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow duration-150 min-h-[200px] relative group"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 mr-4">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
            {post.body}
          </p>
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
          onClick={handleDelete}
          disabled={isDeleting}
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
  );
};

export default React.memo(PostCard);
