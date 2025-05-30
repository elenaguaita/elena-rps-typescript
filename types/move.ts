import { match } from "ts-pattern";
import { z } from "zod";

export const MoveEnum = z.enum(["Rock", "Paper", "Scissors"]);
export type Move = z.infer<typeof MoveEnum>;

export const move = MoveEnum;

export function read(input: string): Move | null {
  return match(input)
    .returnType<Move | null>()
    .with("0", () => "Rock")
    .with("1", () => "Paper")
    .with("2", () => "Scissors")
    .otherwise(() => null);
}
