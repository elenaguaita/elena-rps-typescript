import { match } from "ts-pattern";
import { moves, Move } from "./types/move";
import { Result, results } from "./types/result";
import { Game } from "./types/game";
import { PrismaClient } from "./generated/client";

const prisma = new PrismaClient();

export function generateRandomMove(): Move {
  const moveValues = Object.values(moves);
  return moveValues[Math.floor(Math.random() * moveValues.length)];
}

export function calculateResult(userMove: Move, computerMove: Move): Result {
  return match<[Move, Move]>([userMove, computerMove])
    .returnType<Result>()
    .with(
      [moves.rock, moves.scissors],
      [moves.paper, moves.rock],
      [moves.scissors, moves.paper],
      () => results.youWin,
    )
    .with(
      [moves.scissors, moves.rock],
      [moves.rock, moves.paper],
      [moves.paper, moves.scissors],
      () => results.youLose,
    )
    .with(
      [moves.scissors, moves.scissors],
      [moves.rock, moves.rock],
      [moves.paper, moves.paper],
      () => results.draw,
    )
    .exhaustive();
}

export function getInstructions(): string {
  return "The rules are very simple: send 0 for rock, 1 for paper, 2 for scissors";
}

export async function getGames(): Promise<Game[]> {
  const lastGames = await prisma.game.findMany({
    where: {
      open: false,
    },
    orderBy: {
      date: "desc",
    },
  });

  return lastGames.map((game) => Game.parse(game));
}

export async function play(userMove: Move): Promise<Result> {
  const computerMove = generateRandomMove();
  const gameResult = calculateResult(userMove, computerMove);

  await prisma.game.create({
    data: {
      open: false,
      playerMove: userMove,
      computerMove: computerMove,
      result: gameResult,
    },
  });

  return gameResult;
}
