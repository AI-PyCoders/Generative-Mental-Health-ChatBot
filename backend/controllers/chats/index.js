import express from "express";
import { verifyToken } from "../../middlewares/index.js";

import * as chatsController from "./chats.controller.js";

const { Router } = express;
const router = Router();

router.post("/send-message", verifyToken, chatsController.sendMessage);
router.get("/logged-in-user", verifyToken, chatsController.getParticularUserChat);
router.get("/:id", verifyToken, chatsController.getParticularChat);
router.post("/", chatsController.createChatRoom);

const makeRoutes = (app) => {
  app.use("/chats", router);
};

export { makeRoutes };
