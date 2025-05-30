import { z } from "zod";

export const ResultKindEnum = z.enum(["positive", "negative", "neutral"]);
export type ResultKind = z.infer<typeof ResultKindEnum>;

export const result = z.object({
  kind: ResultKindEnum,
  date: z.coerce.date(),
});

export type Result = z.infer<typeof result>;
