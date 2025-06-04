import { z } from "zod";
import { StringMove } from "./move";
import { Result } from "./result";

export const Game = z.object({
  id: z.string(),
  date: z.coerce.date(),
  open: z.boolean(),
  playerMove: StringMove,
  computerMove: StringMove,
  result: Result,
  //   omit playerId and player data
});
export type Game = z.infer<typeof Game>;
