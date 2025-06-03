-- CreateEnum
CREATE TYPE "Move" AS ENUM ('rock', 'paper', 'scissors');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "computerMove" "Move",
ADD COLUMN     "playerMove" "Move";
