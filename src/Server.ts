import express from "express";
import { config } from "./config/index";
import { ConnectDB } from "./config/db";
import "./cron/subscription.cron";

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


async function create() {
  await Groups.create({
    groupId: "1002776270741",
    owner: "68dfcc25e878127b7bf40509",
    subscriptionPrice: 200,
  });
}

StartServer();
