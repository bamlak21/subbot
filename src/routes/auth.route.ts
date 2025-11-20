import { Router } from "express";
import { telegramAuth, userDetails } from "../controllers/auth.controller";
import authMiddleWare from "../middleware/auth.middleware";

const router = Router();

router.get("/telegram-check", telegramAuth);

router.get("/user/details", authMiddleWare, userDetails);

export default router;
