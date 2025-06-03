import { z } from "zod";

export const resultKinds = {
  youWin: "youWin",
  youLose: "youLose",
  draw: "draw",
} as const;

export const ResultKind = z.enum([
  resultKinds.youWin,
  resultKinds.youLose,
  resultKinds.draw,
]);
export type ResultKind = z.infer<typeof ResultKind>;

export const Result = z.object({
  kind: ResultKind,
  date: z.coerce.date(),
});

export type Result = z.infer<typeof Result>;
