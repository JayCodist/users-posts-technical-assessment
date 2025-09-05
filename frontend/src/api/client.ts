import { User, Post, CreatePostRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Users API
  async getUsers(pageNumber: number = 0, pageSize: number = 4): Promise<User[]> {
    return this.request<User[]>(`/users?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  async getUsersCount(): Promise<{ count: number }> {
    return this.request<{ count: number }>('/users/count');
  }

  async getUser(userId: string): Promise<User> {
    return this.request<User>(`/users/${userId}`);
  }

  // Posts API
  async getUserPosts(userId: string): Promise<Post[]> {
    return this.request<Post[]>(`/posts?userId=${userId}`);
  }

  async createPost(post: CreatePostRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>('/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  async deletePost(postId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/posts?postId=${postId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
