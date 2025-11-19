import { Router } from "express";
import { telegramAuth } from "../controllers/auth.controller";

const router = Router();

router.get("/telegram-check", telegramAuth);

export default router;
