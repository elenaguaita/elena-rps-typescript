import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { match, P } from "ts-pattern";
import { Move, read } from "./types/move";

const rl = createInterface({ input, output });

const calculateResult = (userMove: Move, computerMove: Move) =>
  match<[Move, Move]>([userMove, computerMove])
    .with(["Rock", "Scissors"], ["Paper", "Rock"], ["Scissors", "Paper"], () =>
      rl.write("You win!")
    )
    .with(["Scissors", "Rock"], ["Rock", "Paper"], ["Paper", "Scissors"], () =>
      rl.write("You lose...")
    )
    .with(["Scissors", "Scissors"], ["Rock", "Rock"], ["Paper", "Paper"], () =>
      rl.write("It's a draw.")
    )
    .exhaustive();

export async function play(question: string) {
  const userInput = (await rl.question(question)).trim();
  const userMove = read(userInput);
  if (!userMove) {
    rl.write("That's not a valid move.");
    return;
  }
  const computerMove = generateRandomMove();

  rl.write(`You played: ${userMove}\nComputer played: ${computerMove}\n`);
  calculateResult(userMove, computerMove);
}

function generateRandomMove(): Move {
  const moves: Move[] = ["Rock", "Paper", "Scissors"];
  return moves[Math.floor(Math.random() * 3)];
}
