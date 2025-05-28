import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { match, P } from "ts-pattern";

const rl = createInterface({ input, output });

const calculateResult = (userMove: string, computerMove: string) =>
  match([userMove, computerMove])
    .with(["0", "2"], ["1", "0"], ["2", "1"], () => rl.write("You win!"))
    .with(
      P.when(([u, c]) => u === c),
      () => rl.write("It's a draw.")
    )
    .otherwise(() => rl.write("You lose..."));

export async function play(question: string) {
  const userMove = (await rl.question(question)).trim();
  const computerMove = generateRandomMove();

  if (!["0", "1", "2"].includes(userMove)) rl.write("That's not a valid move.");
  else {
    rl.write(`You played: ${userMove}\nComputer played: ${computerMove}\n`);
    calculateResult(userMove, computerMove);
  }
}

function generateRandomMove(): string {
  return Math.floor(Math.random() * 3).toString();
}
