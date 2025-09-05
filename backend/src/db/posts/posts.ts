import { connection } from "../connection";
import { addPostTemplate, deletePostTemplate, selectPostsTemplate } from "./query-tamplates";
import { Post } from "./types";
import { randomUUID } from "crypto";

export const getPosts = (userId: string): Promise<Post[]> =>
  new Promise((resolve, reject) => {
    connection.all(selectPostsTemplate, [userId], (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results as Post[]);
    });
  });


  export const deletePost = (postId: string): Promise<void> =>
    new Promise((resolve, reject) => {
      connection.run(deletePostTemplate, [postId], (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });

  export const addPost = (post: Post): Promise<void> =>
    new Promise((resolve, reject) => {
      const postId = randomUUID().replace(/-/g, ''); // Generate UUID and remove dashes to match existing format
      const now = new Date();
      // Convert to local timezone instead of ISO string
      // so as to follow the current format of the created_at column in the database
      const createdAt = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .replace('Z', '')
        .replace(/\.\d{3}/, '') + 
        (now.getTimezoneOffset() <= 0 ? '+' : '-') + 
        String(Math.floor(Math.abs(now.getTimezoneOffset()) / 60)).padStart(2, '0') + ':' + 
        String(Math.abs(now.getTimezoneOffset()) % 60).padStart(2, '0');
      connection.run(addPostTemplate, [postId, post.title, post.body, post.user_id, createdAt], (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });