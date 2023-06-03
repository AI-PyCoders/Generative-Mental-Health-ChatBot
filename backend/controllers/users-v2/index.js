import express from "express";
import { verifyToken } from "../../middlewares/index.js";

import * as usersController from "./users.controller.js";

const { Router } = express;
const router = Router();

router.post("/login", usersController.loginUser);
router.get("/logout", verifyToken, usersController.logoutUser);

const makeRoutes = (app) => {
  app.use("/users", router);
};

export { makeRoutes };
