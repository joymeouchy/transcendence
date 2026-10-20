import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
dotenv.config();

// public URLs the browser uses to reach each side (through Caddy), set in .env.
// trailing slashes are stripped so `${URL}/path` never produces "//path".
// the regex /\/+$/ means "one or more / at the very end"
const trim = (url: string) => url.replace(/\/+$/, "");

// FRONTEND_URL: allowed origin for CORS and sockets, and where the Google
// login and password reset links send the user.
// BACKEND_URL: base for the Google OAuth callback URL, the Swagger "Try it out"
// calls and old /uploads avatar links (see prisma.ts).
// the fallbacks are the local Caddy address, used if .env doesn't set them
export const FRONTEND_URL = trim(process.env.FRONTEND_URL || "https://localhost:8443");
export const BACKEND_URL = trim(process.env.BACKEND_URL || "https://localhost:8443/api");

// refuse to start without a real secret - a hardcoded fallback would let
// anyone who reads the source sign valid tokens for any user
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set. Add it to .env before starting the server.");
}
// read after the check above, so TypeScript knows it's a string and not undefined
export const JWT_SECRET: string = process.env.JWT_SECRET;
