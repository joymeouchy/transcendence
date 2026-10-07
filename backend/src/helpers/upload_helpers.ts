import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

// avatars are stored in Supabase Storage (public bucket "avatars") so every
// machine - teammates, evaluators, the hosted server - sees the same images.
// the files used to live in backend/uploads on whichever machine received them
const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const AVATAR_BUCKET = "avatars";
const PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${AVATAR_BUCKET}/`;

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (!ALLOWED_MIME_TYPES[file.mimetype]) {
    return cb(new Error("Only JPEG, PNG, WEBP, or GIF images are allowed"));
  }
  cb(null, true);
};

// keep the file in memory (req.file.buffer) - it goes straight to Supabase
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
  const filename = `${userId}-${Date.now()}${ALLOWED_MIME_TYPES[file.mimetype]}`;

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

// deletes a previously uploaded avatar; ignores URLs that aren't ours (Google
// avatars, old /uploads paths) and never throws, since it's only cleanup
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
