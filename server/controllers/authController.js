import bcrypt from "bcrypt";
import { pool } from "../db.js";
import { setuserid } from "../services/auth.js";

export async function Register(req, res) {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email",
            [name, email, hashedPassword]
        );
        const token = setuserid(result.rows[0]);
        res.cookie("uid", token, { httpOnly: true });
        res.json({ message: "User registered successfully" });
    } catch {
        res.status(400).json({ error: "User already exists" });
    }
}

export async function Login(req, res) {
    const { email, password } = req.body;

    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (result.rowCount === 0) {
        return res.status(401).json({error: "Invalid credentials"});
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(401).json({ error: "Invalid Password" });
    }

    const token = setuserid(user);
    res.cookie("uid", token, { httpOnly: true });
    res.json({ message: "Login successful" });
}

export function Logout(req, res) {
    res.clearCookie("uid");
    res.json({ message: "Logout successful" });
}