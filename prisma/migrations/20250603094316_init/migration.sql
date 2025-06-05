-- CreateEnum
CREATE TYPE "ResultKind" AS ENUM ('positive', 'negative', 'neutral');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "open" BOOLEAN NOT NULL DEFAULT false,
    "result" "ResultKind",
    "playerId" UUID NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);
