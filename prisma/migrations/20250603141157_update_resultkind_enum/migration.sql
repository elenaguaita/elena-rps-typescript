/*
  Warnings:

  - The values [positive,negative,neutral] on the enum `ResultKind` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ResultKind_new" AS ENUM ('youWin', 'youLose', 'draw');
ALTER TABLE "Game" ALTER COLUMN "result" TYPE "ResultKind_new" USING ("result"::text::"ResultKind_new");
ALTER TYPE "ResultKind" RENAME TO "ResultKind_old";
ALTER TYPE "ResultKind_new" RENAME TO "ResultKind";
DROP TYPE "ResultKind_old";
COMMIT;
