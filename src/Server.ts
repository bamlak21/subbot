import express from "express";
import cors from "cors";
import { config } from "./config/index";
import { ConnectDB } from "./config/db";
import "./cron/subscription.cron";
import adminRoutes from "./routes/admin.route";
import authRoutes from "./routes/auth.route";

const app = express();

app.use(
  cors({
    origin: "https://subbot-dash.bamlak.dev",
  })
);

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

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
