/*
  Warnings:

  - You are about to drop the column `status` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "preferredTheme" TEXT NOT NULL DEFAULT 'classic';

-- DropEnum
DROP TYPE "MatchStatus";

-- CreateTable
CREATE TABLE "Customization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "backgroundColor" TEXT,
    "backgroundImageUrl" TEXT,
    "leftPaddleColor" TEXT,
    "leftPaddleImageUrl" TEXT,
    "rightPaddleColor" TEXT,
    "rightPaddleImageUrl" TEXT,
    "ballColor" TEXT,
    "ballImageUrl" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Customization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customization_name_key" ON "Customization"("name");
