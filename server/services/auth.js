import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function setuserid(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

export function getuserid(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
}