import { bot } from "./bot";
import { ConnectDB } from "./config/db";

export async function Bot() {
  try {
    await ConnectDB();
    const botInfo = await bot.telegram.getMe();
    console.log(`🤖 Logged in as @${botInfo.username}`);
    console.log("🚀 Launching bot...");
    console.log("✅ Bot launched and listening for updates");

    await bot.launch();
  } catch (err) {
    console.error("Bot failed to start:", err);
    process.exit(1);
  }
}

Bot();

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
