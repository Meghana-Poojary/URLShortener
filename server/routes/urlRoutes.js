import express from "express";
import { ShortenUrl, RedirectUrl, DeleteUrl, GetAnalytics } from "../controllers/urlController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/shorten", requireAuth, ShortenUrl);
router.get("/:code", RedirectUrl);
router.delete("/:id", requireAuth, DeleteUrl);
router.get("/analytics/:id", requireAuth, GetAnalytics);

export default router;