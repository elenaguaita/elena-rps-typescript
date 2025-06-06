import { describe, it, expect, test, afterEach, vi } from "vitest";
import { calculateResult, generateRandomMove } from "../rps";
import { moves, Move } from "../types/move";
import { Result, results } from "../types/result";
import { ZodError } from "zod";

describe("Move.safeParse(userInput)", () => {
  test.each<[string, Move]>([
    ["0", moves.rock],
    ["1", moves.paper],
    ["2", moves.scissors],
  ])('if user inputs %s, should parse it into "%s"', (userInput, expected) => {
    expect(Move.safeParse(userInput).data).toBe(expected);
  });

  it("should return a ZodError for invalid inputs", () => {
    const invalidInputs = [
      // Add here other invalid inputs
      "3",
      "-1",
      "a",
      "",
      "rock",
      " ",
      "null",
      "undefined",
      "NaN",
    ];

    for (const input of invalidInputs) {
      expect(Move.safeParse(input).error).toBeInstanceOf(ZodError);
    }
  });
});

describe("generateRandomMove", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test.each<[number, Move]>([
    [0.0, moves.rock],
    [0.4, moves.paper],
    [0.8, moves.scissors],
  ])(
    'if Math.random returns %d, should return "%s"',
    (randomOutput, expected) => {
      vi.spyOn(Math, "random").mockReturnValue(randomOutput);
      expect(generateRandomMove()).toBe(expected);
    },
  );
});

describe("calculateResult", () => {
  test.each<[Move, Move, Result]>([
    [moves.rock, moves.scissors, results.youWin],
    [moves.paper, moves.rock, results.youWin],
    [moves.scissors, moves.paper, results.youWin],
    [moves.scissors, moves.rock, results.youLose],
    [moves.rock, moves.paper, results.youLose],
    [moves.paper, moves.scissors, results.youLose],
    [moves.rock, moves.rock, results.draw],
    [moves.paper, moves.paper, results.draw],
    [moves.scissors, moves.scissors, results.draw],
  ])(
    'if user plays %s and computer plays %s, should return "%s"',
    (userMove, computerMove, expected) => {
      expect(calculateResult(userMove, computerMove)).toBe(expected);
    },
  );
});
