import { PrismaClient } from "../generated/prisma/client";
import { BACKEND_URL } from "./urls";

// uploaded avatars are stored as relative paths ("/uploads/avatars/x.png") so
// the host isn't baked into the DB; prefix the current BACKEND_URL on every read.
// OAuth avatars (full https URLs) and null are returned unchanged.
export const toPublicAvatarUrl = (avatarUrl: string | null) =>
  avatarUrl?.startsWith("/uploads/") ? `${BACKEND_URL}${avatarUrl}` : avatarUrl;

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
