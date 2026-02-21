import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/short_url", urlRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to URL Shortener");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
