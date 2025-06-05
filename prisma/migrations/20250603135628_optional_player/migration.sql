-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_playerId_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "playerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
