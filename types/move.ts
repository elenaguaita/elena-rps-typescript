import { match } from "ts-pattern";

export type Move = "Rock" | "Paper" | "Scissors";

export function read(input: string): Move | null {
  return match(input)
    .with("0", (): Move => "Rock")
    .with("1", (): Move => "Paper")
    .with("2", (): Move => "Scissors")
    .otherwise(() => null);
}
