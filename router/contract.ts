import { initContract } from "@ts-rest/core";
import { Game } from "../types/game";
import { Result } from "../types/result";

const c = initContract();

export const rpsContract = c.router({
  start: {
    method: "GET",
    path: "/start",
    responses: {
      200: c.type<{ instructions: string }>(),
    },
    summary: "Get the instructions for rock-paper-scissors",
  },

  play: {
    method: "POST",
    path: "/play",
    body: c.type<{ move: "string" }>(),
    responses: {
      200: c.type<{ result: Result }>(),
      400: c.type<{ error: string }>(),
    },
    summary: "Play a game of rock-paper-scissors",
  },

  games: {
    method: "GET",
    path: "/games",
    responses: {
      200: c.type<{ games: Game[] }>(),
    },
    summary: "Get the last games played",
  },
});
