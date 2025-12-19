import { getuserid } from "../services/auth.js";

export function requireAuth(req, res, next) {
    const token = req.cookies.uid;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const user = getuserid(token);
    if (!user) {
        return res.status(401).json({error: "Invalid token"});
    }

    req.user = user;
    next();
}