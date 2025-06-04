import { match } from "ts-pattern";
import { z } from "zod";

export const moves = {
  rock: "rock",
  paper: "paper",
  scissors: "scissors",
} as const;

export const Move = z.enum(["0", "1", "2"]).transform((input) =>
  match(input)
    .with("0", () => moves.rock)
    .with("1", () => moves.paper)
    .with("2", () => moves.scissors)
    .exhaustive(),
);
export type Move = z.infer<typeof Move>;
