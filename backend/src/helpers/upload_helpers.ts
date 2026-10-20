import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

// avatar upload handling: multer reads the file from the request, and the
// functions below upload it to and delete it from Supabase Storage.

// avatars are stored in Supabase Storage (public bucket "avatars")
const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const AVATAR_BUCKET = "avatars";
const PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${AVATAR_BUCKET}/`;

// accepted image types → the file extension used when saving them
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

// multer calls this for each file before accepting it. cb(error) rejects the
// file and the route answers 400, cb(null, true) accepts it.
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (!ALLOWED_IMAGE_TYPES[file.mimetype]) {
    return cb(new Error("Only JPEG, PNG, WEBP, or GIF images are allowed"));
  }
  cb(null, true);
};

export const avatarUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const storageHeaders = () => {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set in .env",
    );
  }
  return { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
};

// uploads the avatar and returns its public URL (stored as-is in the DB)
export async function uploadAvatar(
  userId: number,
  file: Express.Multer.File,
): Promise<string> {
  // e.g. "10-1785953759297.jpg". the timestamp makes every upload a new file
  // with a new URL, so browsers don't keep showing a cached old picture
  const filename = `${userId}-${Date.now()}${ALLOWED_IMAGE_TYPES[file.mimetype]}`;

  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${AVATAR_BUCKET}/${filename}`,
    {
      method: "POST",
      headers: { ...storageHeaders(), "Content-Type": file.mimetype },
      body: new Uint8Array(file.buffer),
    },
  );
  if (!res.ok) {
    throw new Error(
      `Supabase upload failed (${res.status}): ${await res.text()}`,
    );
  }

  return PUBLIC_PREFIX + filename;
}

// deletes a previously uploaded avatar. ignores URLs that aren't ours (Google
// avatars, old /uploads paths) and never throws, since it's only cleanup.
// Supabase's delete call takes a list of file paths inside the bucket ("prefixes")
export async function deleteAvatar(avatarUrl: string | null | undefined) {
  if (!avatarUrl?.startsWith(PUBLIC_PREFIX)) return;

  try {
    await fetch(`${SUPABASE_URL}/storage/v1/object/${AVATAR_BUCKET}`, {
      method: "DELETE",
      headers: { ...storageHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        prefixes: [avatarUrl.slice(PUBLIC_PREFIX.length)],
      }),
    });
  } catch (err) {
    console.error("Failed to delete old avatar:", err);
  }
}
