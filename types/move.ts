import { match } from "ts-pattern";

export type Move = "Rock" | "Paper" | "Scissors";

export function read(input: string): Move | null {
  return match(input)
    .returnType<Move | null>()
    .with("0", () => "Rock")
    .with("1", () => "Paper")
    .with("2", () => "Scissors")
    .otherwise(() => null);
}
