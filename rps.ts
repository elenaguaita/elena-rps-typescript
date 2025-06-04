import { createInterface } from "node:readline/promises";
import { match } from "ts-pattern";
import { moves, Move } from "./types/move";
import { Result, results } from "./types/result";
import { PrismaClient } from "@prisma/client";
import { Game } from "./types/game";

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

// incapsulate input/output handling
export async function play(
  input: NodeJS.ReadableStream,
  output: NodeJS.WritableStream,
) {
  const rl = createInterface({ input, output });

  const lastGame = Game.safeParse(
    await prisma.game.findFirst({
      where: {
        open: false,
      },
      orderBy: {
        date: "desc",
      },
    }),
  );
  // print the last closed game, if exists
  if (lastGame.success) {
    const data = lastGame.data;
    console.log(
      `Let's play!\nAbout the last game you played:\n- date ${data.date.getDate()}/${data.date.getMonth() + 1}/${data.date.getFullYear()}\n- you played ${data.playerMove}, computer played ${data.computerMove}\n- the result was ${data.result}`,
    );
  }

  const thisGame = await prisma.game.create({
    data: {
      open: true,
    },
  });

  const userInput = (
    await rl.question("Wanna play? 0 for rock, 1 for paper, 2 for scissors: ")
  ).trim();

  const userMove = Move.safeParse(userInput);
  if (!userMove.success) {
    rl.write("That's not a valid move.\n");
    userMove.error.issues.forEach((issue) => rl.write(`[${issue.message}]`));
    return;
  }
  const computerMove = generateRandomMove();
  await prisma.game.update({
    where: { id: thisGame.id },
    data: {
      playerMove: userMove.data,
      computerMove: computerMove,
    },
  });

  rl.write(`You played: ${userMove.data}\nComputer played: ${computerMove}\n`);

  const gameResult = calculateResult(userMove.data, computerMove);
  await prisma.game.update({
    where: { id: thisGame.id },
    data: {
      result: gameResult,
      open: false,
    },
  });

  rl.write(
    "The result is... " +
      match(gameResult)
        .returnType<string>()
        .with(results.youWin, () => "You win!")
        .with(results.draw, () => "It's a draw")
        .with(results.youLose, () => "You lose...")
        .exhaustive(),
  );
}
