import express from "express";
import { config } from "./config/index";
import { ConnectDB } from "./config/db";
import { Groups } from "./model/groups.model";
import { Types } from "mongoose";

const app = express();

async function StartServer() {
  try {
    await ConnectDB();
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Server failed to start", error);
  }
}

StartServer();
