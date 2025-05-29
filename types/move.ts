export type Move = "0" | "1" | "2";

export function read(input: string): Move {
  return input as Move;
}
