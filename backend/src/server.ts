import express from "express";
import type { Request, Response } from "express";
import { errorMonitor } from "node:events";
import debug from "debug";

const PORT = process.env.PORT;
const server_log = debug("app:server");
const app = express();
const startServer = async () => {
  try {
    if (!PORT) {
      throw new Error("Could not load environment variable");
    }
  } catch (error) {
    server_log("Server could not connect");
    console.error(error);
  }
};
