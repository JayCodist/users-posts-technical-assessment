import { Router, Request, Response } from "express";
import { addPost, deletePost, getPosts } from "../db/posts/posts";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId?.toString();
    if (!userId) {
      res.status(400).send({ error: "userId is required" });
      return;
    }
    const posts = await getPosts(userId);
    res.send(posts);
  } catch (err) {
    console.error("Unable to get posts: ", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.delete("/", async (req: Request, res: Response) => {
  try {
    const postId = req.query.postId?.toString();
    if (!postId) {
      res.status(400).send({ error: "postId is required" });
      return;
    }
    await deletePost(postId);
    res.send({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Unable to delete post: ", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const post = req.body;
    const missingFields = ["title", "body", "user_id"].filter((field) => !post[field]?.toString());
    if (missingFields.length > 0) {
      res.status(400).send({ error: `Missing required fields: ${missingFields.join(", ")}` });
      return;
    }
    await addPost(post);
    res.send({ message: "Post added successfully" });
  } catch (err) {
    console.error("Unable to add post: ", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

export default router;
