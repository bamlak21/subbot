import { handleRenewalInvoice } from "../../services/payment.service";
import { markSubscriptionPaid } from "../../services/subscription.service";
import { bot } from "../index";

bot.on("callback_query", async (ctx) => {
  const callBackQuery = ctx.callbackQuery;

  if ("data" in callBackQuery && typeof callBackQuery.data === "string") {
    const data = callBackQuery.data;
    await ctx.answerCbQuery();

    await handleRenewalInvoice(ctx, data);
  }
});

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

    const sub = await markSubscriptionPaid(payload);
    if (!sub) {
      return "Sub not found";
    }

    const invite = await bot.telegram.createChatInviteLink(`-${sub.groupId}`, {
      member_limit: 1,
    });
    await ctx.reply(
      `🎉 Payment successful! Your subscription is now active.\n\n` +
        `Join the group using this link: ${invite.invite_link}`
    );
  } catch (err) {
    console.error("Failed to mark subscription paid:", err);
  }
});
