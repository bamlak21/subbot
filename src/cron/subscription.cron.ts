import cron from "node-cron";
import { getExpiringSubscriptions } from "../services/subscription.service";
import { bot } from "../bot";

cron.schedule("0 0 * * *", async () => {
  console.log("🔁 Running expiration and reminder check...");

  try {
    const expiring = await getExpiringSubscriptions();

    if (!expiring) {
      return "No expiring found";
    }

    for (const e of expiring) {
      if (e.type === "reminder") {
        await bot.telegram.sendMessage(
          e.sub.telegramId,
          `You have ${e.daysLeft} days left before your subscription for group ends`,
          {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Renew now", callback_data: `${e.sub._id}` }],
              ],
            },
          }
        );

        const user = await bot.telegram.getChat(e.sub.telegramId);
        if ("username" in user) {
          console.log(`Reminder sent to @${user.username}`);
        } else {
          console.log(`Reminder sent to ${e.sub.telegramId}`);
        }
      } else if (e.type === "expired") {
        await bot.telegram.kickChatMember(e.sub.groupId, e.sub.telegramId);
        await bot.telegram.unbanChatMember(e.sub.groupId, e.sub.telegramId); // unbans user so they can return later
        console.log(`User ${e.sub.telegramId} has been removed from the group`);
      }
    }

    console.log("✅ Subscription cron finished.");
  } catch (error) {
    console.error("❌ Error in subscription cron:", error);
  }
});
