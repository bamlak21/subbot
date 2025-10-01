import { Types } from "mongoose";
import { Context } from "telegraf";
import { config } from "../config";
import {
  CreateSubscription,
  FindExistingSubscription,
} from "./subscription.service";
import { Status } from "../types/subscription.type";

type Props = {
  ctx: Context;
  subscriptionPrice: number;
  userId: Types.ObjectId;
  telegramId: number;
  groupId: string;
};

export const CreateInvoice = async ({
  ctx,
  subscriptionPrice,
  userId,
  telegramId,
  groupId,
}: Props) => {
  const priceInCents = Math.round(subscriptionPrice * 100); // chapa accepts amount in cents

  const existingSub = await FindExistingSubscription(
    userId,
    groupId,
    Status.ACTIVE
  );

  if (existingSub) {
    return await ctx.reply("✅ You already have an active subscription.");
  }

  const createSub = await CreateSubscription(
    groupId,
    userId,
    telegramId,
    subscriptionPrice
  );
  if (!createSub) {
    return "failed to create Subscription";
  }

  try {
    const payload = createSub._id.toString();
    await ctx.replyWithInvoice({
      title: "Group Sub",
      description: "Pay to join the group ",
      payload: payload,
      provider_token: config.paymentToken,
      currency: "ETB",
      prices: [{ label: "Group Access", amount: priceInCents }],
      start_parameter: "pay",
    });
  } catch (error) {
    console.error(error);
    await ctx.reply(
      "⚠️ Could not send the payment invoice. Please try again later."
    );
  }
};
