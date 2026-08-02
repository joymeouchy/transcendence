import prisma from "../src/prisma";

async function main() {
  // Classic: colors used in the frontend canvas
  await prisma.customization.upsert({
    where: { name: "classic" },
    update: {
      backgroundColor: "#111827",
      leftPaddleColor: "white",
      rightPaddleColor: "white",
      ballColor: "white",
      isDefault: true,
    },
    create: {
      name: "classic",
      backgroundColor: "#111827",
      leftPaddleColor: "white",
      rightPaddleColor: "white",
      ballColor: "white",
      isDefault: true,
    },
  });

  // Football theme: images from frontend/public
  await prisma.customization.upsert({
    where: { name: "football" },
    update: {
      backgroundImageUrl: "/pong_bg_1.png",
      leftPaddleImageUrl: "/pong_leftpadel_1.png",
      rightPaddleImageUrl: "/pong_rightpadel_1.png",
      ballImageUrl: "/pong_ball_1.png",
      isDefault: false,
    },
    create: {
      name: "football",
      backgroundImageUrl: "/pong_bg_1.png",
      leftPaddleImageUrl: "/pong_leftpadel_1.png",
      rightPaddleImageUrl: "/pong_rightpadel_1.png",
      ballImageUrl: "/pong_ball_1.png",
      isDefault: false,
    },
  });

  console.log("Seed complete: added/updated classic and football themes");
}

main()
  .catch((e) => {
    console.error(e);
    throw e; // ← replace process.exit(1) with this
  })
  .finally(async () => {
    await prisma.$disconnect();
  });