import { createInterface } from "node:readline/promises";
import { match, P } from "ts-pattern";
import { move, Move, read } from "./types/move";
import { Result, result } from "./types/result";

export function generateRandomMove(): Move {
  const moves: Move[] = ["Rock", "Paper", "Scissors"];
  return moves[Math.floor(Math.random() * 3)];
}

export function calculateResult(userMove: Move, computerMove: Move): Result {
  return match<[Move, Move]>([userMove, computerMove])
    .returnType<Result>()
    .with(
      ["Rock", "Scissors"],
      ["Paper", "Rock"],
      ["Scissors", "Paper"],
      () => ({
        kind: "positive",
        date: new Date(),
      }),
    )
    .with(
      ["Scissors", "Rock"],
      ["Rock", "Paper"],
      ["Paper", "Scissors"],
      () => ({
        kind: "negative",
        date: new Date(),
      }),
    )
    .with(
      ["Scissors", "Scissors"],
      ["Rock", "Rock"],
      ["Paper", "Paper"],
      () => ({
        kind: "neutral",
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
      "Wanna play? Let's play!\n0 for Rock, 1 for Paper, 2 for Scissors: ",
    )
  ).trim();
  const userMove = move.safeParse(read(userInput));
  if (!userMove.success) {
    rl.write("That's not a valid move.\n");
    userMove.error.issues.forEach((issue) => rl.write(`[${issue.message}]`));
    return;
  }
  const computerMove = generateRandomMove();

  rl.write(`You played: ${userMove.data}\nComputer played: ${computerMove}\n`);

  const gameResult = result.safeParse(
    calculateResult(userMove.data, computerMove),
  );
  if (!gameResult.success) {
    gameResult.error.issues.map((issue) => rl.write(`${issue.message}\n`));
  } else {
    rl.write(
      "The result is... " +
        match(gameResult.data.kind)
          .returnType<string>()
          .with("positive", () => "You win!")
          .with("neutral", () => "It's a draw")
          .with("negative", () => "You lose...")
          .exhaustive(),
    );
  }
}
