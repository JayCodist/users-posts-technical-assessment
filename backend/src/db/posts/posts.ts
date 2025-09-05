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

      const createdAt = new Date().toISOString();
      connection.run(addPostTemplate, [postId, post.title, post.body, post.user_id, createdAt], (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });