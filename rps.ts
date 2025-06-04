import { createInterface } from "node:readline/promises";
import { match } from "ts-pattern";
import { moves, Move } from "./types/move";
import { Result, resultKinds } from "./types/result";
import { PrismaClient } from "@prisma/client";

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
      () => ({
        kind: resultKinds.youWin,
        date: new Date(),
      }),
    )
    .with(
      [moves.scissors, moves.rock],
      [moves.rock, moves.paper],
      [moves.paper, moves.scissors],
      () => ({
        kind: resultKinds.youLose,
        date: new Date(),
      }),
    )
    .with(
      [moves.scissors, moves.scissors],
      [moves.rock, moves.rock],
      [moves.paper, moves.paper],
      () => ({
        kind: resultKinds.draw,
        date: new Date(),
      }),
    )
    .exhaustive();
}

// incapsulate input/output handling
export async function play(
  input: NodeJS.ReadableStream,
  output: NodeJS.WritableStream,
) {
  const rl = createInterface({ input, output });

  const lastGame = await prisma.game.findFirst({
    where: {
      open: false,
    },
    orderBy: {
      date: "desc",
    },
  });
  // print the last closed game, if exists
  if (lastGame) {
    console.log(
      `Let's play!\nAbout the last game you played:\n- date ${lastGame?.date.getDate()}/${lastGame?.date.getMonth() + 1}/${lastGame?.date.getFullYear()}\n- you played ${lastGame?.playerMove}, computer played ${lastGame?.computerMove}\n- the result was ${lastGame?.result}`,
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
      result: gameResult.kind,
      open: false,
    },
  });

  rl.write(
    "The result is... " +
      match(gameResult.kind)
        .returnType<string>()
        .with(resultKinds.youWin, () => "You win!")
        .with(resultKinds.draw, () => "It's a draw")
        .with(resultKinds.youLose, () => "You lose...")
        .exhaustive(),
  );
}
