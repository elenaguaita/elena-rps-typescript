import { z } from "zod";

export const results = {
  youWin: "youWin",
  youLose: "youLose",
  draw: "draw",
} as const;

export const Result = z.enum([results.youWin, results.youLose, results.draw]);

export type Result = z.infer<typeof Result>;
