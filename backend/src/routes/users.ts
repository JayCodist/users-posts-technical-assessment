import { Router, Request, Response } from "express";

import { getUser, getUsers, getUsersCount } from "../db/users/users";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const pageNumber = Number(req.query.pageNumber) || 0;
    const pageSize = Number(req.query.pageSize) || 4;
    if (pageNumber < 0 || pageSize < 1) {
      res.status(400).send({ message: "Invalid page number or page size" });
      return;
    }

    const users = await getUsers(pageNumber, pageSize);
    res.send(users);
  } catch (err) {
    console.error("Unable to get users: ", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.get("/count", async (req: Request, res: Response) => {
  try {
    const count = await getUsersCount();
    res.send({ count });
  } catch (err) {
    console.error("Unable to get users count: ", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await getUser(req.params.id);
    res.send(user);
  } catch (err) {
    console.error("Unable to get user: ", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

export default router;
