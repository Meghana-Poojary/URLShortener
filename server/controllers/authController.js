import bcrypt from "bcrypt";
import { pool } from "../db.js";
import { setuserid, getuserid } from "../services/auth.js";

export async function Register(req, res) {
    console.log(req.body);
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email, name",
            [name, email, hashedPassword]
        );
        const token = setuserid(result.rows[0]);
        const cookieOpts = {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production'
        };
        res.cookie("uid", token, cookieOpts);
        res.json({ message: "User registered successfully", user: { id: result.rows[0].id, email: result.rows[0].email, name: result.rows[0].name } });
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
        return res.status(401).json({error: "User not found"});
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(401).json({ error: "Invalid Password" });
    }

    const token = setuserid(user);
    const cookieOpts = {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production'
    };
    res.cookie("uid", token, cookieOpts);
    res.json({ message: "Login successful", user: { id: user.id, email: user.email, name: user.name } });
}

export async function GetCurrentUser(req, res) {
    const userUid = req.cookies?.uid;
    if (!userUid) return res.status(401).json({ error: "Not logged in" });

    const user = getuserid(userUid); 
    if (!user) return res.status(401).json({ error: "Invalid session" });
    res.json({ user });
}


export function Logout(req, res) {
    res.clearCookie("uid");
    res.json({ message: "Logout successful" });
}