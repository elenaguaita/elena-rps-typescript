import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import { rpsContract } from "./router/contract";
import {
  calculateResult,
  generateRandomMove,
  getGames,
  getInstructions,
  play,
} from "./rps";
import { Move } from "./types/move";

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const s = initServer();

const router = s.router(rpsContract, {
  start: async () => {
    const instructions = getInstructions();
    return { status: 200, body: { instructions } };
  },
  play: async ({ body }) => {
    const userMove = Move.safeParse(body.move);
    if (userMove.success) {
      const result = await play(userMove.data);
      return { status: 200, body: { result } };
    } else {
      const error = userMove.error.message;
      return { status: 400, body: { error } };
    }
  },
  games: async () => {
    const games = await getGames();
    return { status: 200, body: { games } };
  },
});

createExpressEndpoints(rpsContract, router, app);

const port = 3001;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
