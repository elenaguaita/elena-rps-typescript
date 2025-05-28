import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = createInterface({ input, output });

export async function play(question: string) {
  const userMove = (await rl.question(question)).trim();
  const computerMove = generateRandomMove();

  if (!["0", "1", "2"].includes(userMove)) rl.write("That's not a valid move.");
  else {
    rl.write(`You played: ${userMove}\nComputer played: ${computerMove}\n`);
    if (computerMove === userMove) rl.write("It's a draw.");
    else if (
      (userMove === "0" && computerMove === "2") ||
      (userMove === "1" && computerMove === "0") ||
      (userMove === "2" && computerMove === "1")
    ) {
      rl.write("You win!");
    } else {
      rl.write("You lose...");
    }
  }
}

function generateRandomMove(): string {
  return Math.floor(Math.random() * 3).toString();
}
