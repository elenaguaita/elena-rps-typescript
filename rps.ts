import { createInterface } from "node:readline/promises";
import { match, P } from "ts-pattern";
import { Move, read } from "./types/move";

export function generateRandomMove(): Move {
  const moves: Move[] = ["Rock", "Paper", "Scissors"];
  return moves[Math.floor(Math.random() * 3)];
}

export function calculateResult(userMove: Move, computerMove: Move): string {
  return match<[Move, Move]>([userMove, computerMove])
    .with(
      ["Rock", "Scissors"],
      ["Paper", "Rock"],
      ["Scissors", "Paper"],
      () => "You win!"
    )
    .with(
      ["Scissors", "Rock"],
      ["Rock", "Paper"],
      ["Paper", "Scissors"],
      () => "You lose..."
    )
    .with(
      ["Scissors", "Scissors"],
      ["Rock", "Rock"],
      ["Paper", "Paper"],
      () => "It's a draw."
    )
    .exhaustive();
}

// incapsulate input/output handling
export async function play(
  input: NodeJS.ReadableStream,
  output: NodeJS.WritableStream
) {
  const rl = createInterface({ input, output });

  const userInput = (
    await rl.question(
      "Wanna play? Let's play!\n0 for Rock, 1 for Paper, 2 for Scissors: "
    )
  ).trim();
  const userMove = read(userInput);
  if (!userMove) {
    rl.write("That's not a valid move.");
    return;
  }
  const computerMove = generateRandomMove();

  rl.write(`You played: ${userMove}\nComputer played: ${computerMove}\n`);
  rl.write(calculateResult(userMove, computerMove));
}
