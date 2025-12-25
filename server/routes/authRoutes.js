import express from "express";
import { Register, Login, GetCurrentUser,Logout } from "../controllers/authController.js";

const router = express.Router();
router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);
router.get("/me", GetCurrentUser);
export default router;