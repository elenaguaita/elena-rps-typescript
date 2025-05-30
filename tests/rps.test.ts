import { describe, it, expect, test, afterEach, vi } from "vitest";
import { calculateResult, generateRandomMove } from "../rps";
import { Move, read } from "../types/move";

describe("read", () => {
  test.each<[string, Move]>([
    ["0", "Rock"],
    ["1", "Paper"],
    ["2", "Scissors"],
  ])('if user inputs %s, should parse it into "%s"', (userInput, expected) => {
    expect(read(userInput)).toBe(expected);
  });

  it("should return null for invalid inputs", () => {
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
      expect(read(input)).toBeNull();
    }
  });
});

describe("generateRandomMove", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test.each<[number, Move]>([
    [0.0, "Rock"],
    [0.4, "Paper"],
    [0.8, "Scissors"],
  ])(
    'if Math.random returns %d, should return "%s"',
    (randomOutput, expected) => {
      vi.spyOn(Math, "random").mockReturnValue(randomOutput);
      expect(generateRandomMove()).toBe(expected);
    },
  );
});

describe("calculateResult", () => {
  test.each<[Move, Move, string]>([
    ["Rock", "Scissors", "You win!"],
    ["Paper", "Rock", "You win!"],
    ["Scissors", "Paper", "You win!"],
    ["Scissors", "Rock", "You lose..."],
    ["Rock", "Paper", "You lose..."],
    ["Paper", "Scissors", "You lose..."],
    ["Rock", "Rock", "It's a draw."],
    ["Paper", "Paper", "It's a draw."],
    ["Scissors", "Scissors", "It's a draw."],
  ])(
    'if user plays %s and computer plays %s, should return "%s"',
    (userMove, computerMove, expected) => {
      expect(calculateResult(userMove, computerMove)).toBe(expected);
    },
  );
});
