import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load the workspace root env file while running Prisma commands from backend.
config({ path: "../.env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"]!,
    directUrl: process.env["DIRECT_URL"]!,
  },
});
