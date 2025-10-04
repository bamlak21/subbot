import { bot } from "../index";
import { analyzeMessageAI } from "../../services/ai.service";

bot.on("text", async (ctx) => {
  if (ctx.message.from.is_bot) return;

  const text = ctx.message.text;
  const user = ctx.message.from.username;
  const result = await analyzeMessageAI(text);

  if (!result.flagged) return;

  switch (result.severity) {
    case "low":
      await ctx.reply(`⚠️ Warning @${user}: ${result.reason}`);
      break;

    case "medium":
      await ctx.deleteMessage();
      await ctx.reply(
        `🚫 @${user}, your message was removed: ${result.reason}`
      );
      break;

    case "high":
      await ctx.deleteMessage();
      await ctx.reply(
        `❌ @${user}, your message was removed due to severe violation: ${result.reason}`
      );
      // Optional: Temporary ban for 24h
      try {
        await ctx.banChatMember(
          ctx.message.from.id,
          Math.floor(Date.now() / 1000) + 24 * 60 * 60
        );
      } catch (err) {
        console.error("Failed to ban user:", err);
      }
      break;
  }
});
