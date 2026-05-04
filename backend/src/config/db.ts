import debug from "debug";
import mongoose from "mongoose";
import { on } from "node:cluster";
import User from "../models/Client.js";

const db_log = debug("app:db");
const MONGO_URI = process.env.MONGO_URI;

export const connect_db = async () => {
  if (!MONGO_URI) {
    throw new Error("Could not load database key");
  }
  let max_attempts = 5;
  try {
    (mongoose.connection,
      on("disconnect", async () => {
        for (let attempt = 0; attempt < max_attempts; attempt++) {
          await mongoose.connect(MONGO_URI);
        }
      }));

    await mongoose.connect(MONGO_URI);
  } catch (error) {
    console.error(error);
    db_log("Database could not connect");
  }
};

export const prune_unauthorized = () => {
  setTimeout(() => {});
};
