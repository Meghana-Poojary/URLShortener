import express from "express";
import { ShortenUrl, RedirectUrl, DeleteUrl, GetAnalytics, GetUrls } from "../controllers/urlController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/shorten", requireAuth, ShortenUrl);
router.get("/urls", requireAuth, GetUrls);
router.get("/analytics/:id", requireAuth, GetAnalytics);
router.delete("/:id", requireAuth, DeleteUrl);
router.get("/short_url/:code", RedirectUrl);

export default router;