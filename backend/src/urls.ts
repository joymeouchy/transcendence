import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
dotenv.config();

// public URLs the browser uses to reach each side (through Caddy), set in .env.
// trailing slashes are stripped so `${URL}/path` never produces "//path"
const trim = (url: string) => url.replace(/\/+$/, "");

export const FRONTEND_URL = trim(process.env.FRONTEND_URL || "https://localhost");
export const BACKEND_URL = trim(process.env.BACKEND_URL || "https://localhost/api");
