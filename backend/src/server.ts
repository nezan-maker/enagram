import express from "express";
import type { Express } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import debug from "debug";
import { prune_unauthorized } from "./config/db.js";

import { connect_db } from "./config/db.js";

dotenv.config();
const PORT = process.env.PORT;
const server_log = debug("app:server");
const app: Express = express();
morgan("dev");
const startServer = async () => {
  try {
    if (!PORT) {
      throw new Error("Could not load environment variable");
    }
    await connect_db();
    app.listen(PORT, () => {
      server_log(`Server connected on port ${PORT}`);
    });
  } catch (error) {
    server_log("Server could not connect");
    console.error(error);
  }
};
startServer();
prune_unauthorized();
