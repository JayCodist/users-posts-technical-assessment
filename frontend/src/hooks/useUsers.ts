import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Post, CreatePostRequest, User } from '../types';

// Users queries
export const useUsers = (pageNumber: number, pageSize: number = 4) => {
  return useQuery<User[], Error>({
    queryKey: ['users', pageNumber, pageSize],
    queryFn: () => apiClient.getUsers(pageNumber, pageSize),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUsersCount = () => {
  return useQuery<{ count: number }, Error>({
    queryKey: ['users', 'count'],
    queryFn: () => apiClient.getUsersCount(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUser = (userId: string) => {
  return useQuery<User, Error>({
    queryKey: ['user', userId],
    queryFn: () => apiClient.getUser(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Posts queries
export const useUserPosts = (userId: string) => {
  return useQuery<Post[], Error>({
    queryKey: ['posts', userId],
    queryFn: () => apiClient.getUserPosts(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Posts mutations
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ message: string }, Error, CreatePostRequest>({
    mutationFn: (post: CreatePostRequest) => apiClient.createPost(post),
    onSuccess: (_, variables) => {
      // Invalidate and refetch posts for the specific user
      queryClient.invalidateQueries({ queryKey: ['posts', variables.user_id] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ message: string }, Error, { postId: string; userId: string }>({
    mutationFn: ({ postId }) => apiClient.deletePost(postId),
    onSuccess: (_, variables) => {
      // Invalidate and refetch posts for the specific user
      queryClient.invalidateQueries({ queryKey: ['posts', variables.userId] });
    },
  });
};
