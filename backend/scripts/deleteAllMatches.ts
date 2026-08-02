import { PrismaClient } from "../generated/prisma/client";

import prisma from "../src/prisma";

async function main() {
  await prisma.match.deleteMany();
}

main()
  .then(() => console.log("All matches deleted."))
  .catch((err) => {
    console.error(err);
  })
  .finally(() => prisma.$disconnect());
