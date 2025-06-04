import { createInterface } from "node:readline/promises";
import { match } from "ts-pattern";
import { moves, Move } from "./types/move";
import { Result, resultKinds } from "./types/result";

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

  const userInput = (
    await rl.question(
      "Wanna play? Let's play!\n0 for rock, 1 for paper, 2 for scissors: ",
    )
  ).trim();
  const userMove = Move.safeParse(userInput);
  if (!userMove.success) {
    rl.write("That's not a valid move.\n");
    userMove.error.issues.forEach((issue) => rl.write(`[${issue.message}]`));
    return;
  }
  const computerMove = generateRandomMove();

  rl.write(`You played: ${userMove.data}\nComputer played: ${computerMove}\n`);

  const gameResult = calculateResult(userMove.data, computerMove);

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
