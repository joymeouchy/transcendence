// one-time move of old avatars (backend/uploads/avatars on this machine) to Supabase Storage
// Run both with and without --apply to see what would be moved, then actually move them
// Run this once then delete it if you want
//
// dry run (changes nothing):
//   docker compose exec backend npx ts-node scripts/migrateAvatars.ts
// actually move them:
//   docker compose exec backend npx ts-node scripts/migrateAvatars.ts --apply
import fs from "fs";
import path from "path";
import prisma from "../src/prisma";
import { uploadAvatar } from "../src/helpers/upload_helpers";

const UPLOAD_DIR = path.join(__dirname, "../uploads/avatars");
const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

async function main() {
  const apply = process.argv.includes("--apply");

  // the where clause matches the raw DB value; the returned avatarUrl has
  // BACKEND_URL prefixed by the prisma extension, so only its filename is used
  const users = await prisma.user.findMany({
    where: { avatarUrl: { startsWith: "/uploads/avatars/" } },
    select: { id: true, username: true, avatarUrl: true },
  });

  let moved = 0;
  for (const user of users) {
    const filename = path.basename(user.avatarUrl!);
    const filePath = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(filePath)) {
      console.log(`skip   ${user.id} ${user.username}: ${filename} is not on this machine`);
      continue;
    }

    if (!apply) {
      console.log(`would move ${user.id} ${user.username}: ${filename}`);
      continue;
    }

    const mimetype = MIME_TYPES[path.extname(filename).toLowerCase()] ?? "image/jpeg";
    const avatarUrl = await uploadAvatar(user.id, {
      buffer: fs.readFileSync(filePath),
      mimetype,
    } as Express.Multer.File);

    await prisma.user.update({ where: { id: user.id }, data: { avatarUrl } });
    console.log(`moved  ${user.id} ${user.username}: ${avatarUrl}`);
    moved++;
  }

  console.log(apply ? `\n${moved} avatar(s) moved.` : "\nDry run - rerun with --apply to move them.");
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(() => prisma.$disconnect());
