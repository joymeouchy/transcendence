// the one shared Prisma client the whole backend uses to talk to the database.
// every file imports this instead of calling `new PrismaClient()` itself,
// because each client opens its own pool of database connections.
//
// PrismaClient is generated from prisma/schema.prisma by `prisma generate`
// (into generated/prisma, the "output" set in the schema), so its types always
// match the tables
import { PrismaClient } from "../generated/prisma/client";
import { BACKEND_URL } from "./urls";

// older uploaded avatars are stored as relative paths ("/uploads/avatars/x.png")
// so the host isn't baked into the DB. the current BACKEND_URL is added in front on every read.
// new uploads (full Supabase Storage URLs), OAuth avatars and null are returned unchanged.
export const toPublicAvatarUrl = (avatarUrl: string | null) =>
  avatarUrl?.startsWith("/uploads/") ? `${BACKEND_URL}${avatarUrl}` : avatarUrl;

// $extends adds a "result extension": whenever a query returns a user's
// avatarUrl, Prisma runs compute() on it first. so every route gets a usable
// URL without having to remember to convert it.
// `needs` says which DB column compute() reads. the value in the DB is never changed
const prisma = new PrismaClient().$extends({
  result: {
    user: {
      avatarUrl: {
        needs: { avatarUrl: true },
        compute: (user) => toPublicAvatarUrl(user.avatarUrl),
      },
    },
  },
});

export default prisma;
