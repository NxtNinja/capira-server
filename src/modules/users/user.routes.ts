import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import * as controller from "./user.controller";

const router = Router();

router.get("/me", authMiddleware, controller.currentUser);

export default router;
