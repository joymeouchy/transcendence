import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.message.deleteMany(),
    prisma.friendship.deleteMany(),
    prisma.match.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

main()
  .then(() => console.log("All users (and dependent rows) deleted."))
  .catch((err) => {
    console.error(err);
  })
  .finally(() => prisma.$disconnect());
