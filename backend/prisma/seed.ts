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
      backgroundImageUrl:"/pong_classic_bg.png",
      leftPaddleImageUrl: "/pong_bluepaddle.png",
      rightPaddleImageUrl: "/pong_redpaddle.png",
      ballImageUrl: "/pong_neon_ball.png",
      isDefault: true,
    },
    create: {
      name: "classic",
      backgroundColor: "#111827",
      leftPaddleColor: "white",
      rightPaddleColor: "white",
      ballColor: "white",
      backgroundImageUrl:"/pong_classic_bg.png",
      leftPaddleImageUrl: "/pong_bluepaddle.png",
      rightPaddleImageUrl: "/pong_redpaddle.png",
      ballImageUrl: "/pong_neon_ball.png",
      isDefault: true,
    },
  });

  // Football theme: images from frontend/public
  await prisma.customization.upsert({
    where: { name: "football" },
    update: {
      backgroundImageUrl: "/pong_football_bg.png",
      leftPaddleImageUrl: "/pong_football_leftpaddle.png",
      rightPaddleImageUrl: "/pong_football_rightpaddle.png",
      ballImageUrl: "/pong_football_ball.png",
      isDefault: false,
    },
    create: {
      name: "football",
      backgroundImageUrl: "/pong_football_bg.png",
      leftPaddleImageUrl: "/pong_football_leftpaddle.png",
      rightPaddleImageUrl: "/pong_football_rightpaddle.png",
      ballImageUrl: "/pong_football_ball.png",
      isDefault: false,
    },
  });

  await prisma.customization.upsert({
    where: { name: "space" },
    update: {
      backgroundImageUrl: "/pong_space_bg.png",
      leftPaddleImageUrl: "/pong_space_leftpaddle.png",
      rightPaddleImageUrl: "/pong_space_rightpaddle.png",
      ballImageUrl: "/pong_space_ball.png",
      isDefault: false,
    },
    create: {
      name: "space",
      backgroundImageUrl: "/pong_space_bg.png",
      leftPaddleImageUrl: "/pong_space_leftpaddle.png",
      rightPaddleImageUrl: "/pong_space_rightpaddle.png",
      ballImageUrl: "/pong_space_ball.png",
      isDefault: false,
    },
  });

  console.log("Seed complete: added/updated all themes");
}

main()
  .catch((e) => {
    console.error(e);
    throw e; // ← replace process.exit(1) with this
  })
  .finally(async () => {
    await prisma.$disconnect();
  });