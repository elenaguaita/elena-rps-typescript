import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { match, P } from "ts-pattern";
import { Move, read } from "./types/move";

const rl = createInterface({ input, output });

const calculateResult = (userMove: Move, computerMove: Move) =>
  match([userMove, computerMove])
    .with(["0", "2"], ["1", "0"], ["2", "1"], () => rl.write("You win!"))
    .with(
      P.when(([u, c]) => u === c),
      () => rl.write("It's a draw.")
    )
    .otherwise(() => rl.write("You lose..."));

export async function play(question: string) {
  const userInput = (await rl.question(question)).trim();
  if (!["0", "1", "2"].includes(userInput)) {
    rl.write("That's not a valid move.");
    return;
  }

  const userMove = read(userInput);
  const computerMove = generateRandomMove();

  rl.write(`You played: ${userMove}\nComputer played: ${computerMove}\n`);
  calculateResult(userMove, computerMove);
}

function generateRandomMove(): Move {
  return read(Math.floor(Math.random() * 3).toString());
}
