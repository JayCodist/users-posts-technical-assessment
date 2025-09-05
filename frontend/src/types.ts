
export type JsonValue = JsonPrimitive | JsonValue[] | JsonObject;

export type JsonPrimitive = boolean | null | string | number;

export interface JsonObject {
  [key: string]: JsonValue | undefined;
}

// API Types
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
}

export interface UserAddress {
  street: string;
  state: string;
  city: string;
  zipcode: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  body: string;
  created_at: string;
}

export interface Pagination {
  pageNumber: number;
  pageSize: number;
  totalUsers: number;
}

export interface CreatePostRequest {
  title: string;
  body: string;
  user_id: string;
}