import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;
dotenv.config();

// export const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: process.env.NODE_ENV === "production"
//         ? { rejectUnauthorized: false }
//         : false
// });
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
// export const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DATABASE,
//     password: process.env.DB_PASSWORD, 
//     port: 5432,
// });