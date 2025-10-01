import { MarkSubscriptionPaid } from "../../services/subscription.service";
import { bot } from "../index";

bot.on("pre_checkout_query", async (ctx) => {
  try {
    await ctx.answerPreCheckoutQuery(true); // Approve the payment
  } catch (err) {
    console.error("Failed pre-checkout query:", err);
  }
});

bot.on("successful_payment", async (ctx) => {
  try {
    const payload = ctx.message.successful_payment.invoice_payload;

    await MarkSubscriptionPaid(payload);
    await ctx.reply("🎉 Payment successful! Your subscription is now active.");
  } catch (err) {
    console.error("Failed to mark subscription paid:", err);
  }
});
