import { Types } from "mongoose";
import { Context } from "telegraf";
import { config } from "../config";
import {
  createOrRenewSubscription,
  findExistingSubscription,
  getSubscription,
} from "./subscription.service";
import { Status } from "../types/subscription.type";
import { findGroup } from "./groups.service";

type Props = {
  ctx: Context;
  subscriptionPrice: number;
  userId: Types.ObjectId;
  telegramId: number;
  groupId: string;
};

export const generateInvoice = async (
  ctx: Context,
  subscriptionPrice: number,
  createdSubId: Types.ObjectId
) => {
  const priceInCents = Math.round(subscriptionPrice * 100); // chapa accepts amount in cents

  try {
    const payload = createdSubId.toString();
    await ctx.replyWithInvoice({
      title: "Group Sub",
      description: "Pay to join the group ",
      payload: payload,
      provider_token: config.paymentToken,
      currency: "ETB",
      prices: [{ label: "Group Access", amount: priceInCents }],
      start_parameter: "pay",
      send_phone_number_to_provider: true,
      need_phone_number: true,
    });
  } catch (error) {
    console.error(error);
    await ctx.reply(
      "⚠️ Could not send the payment invoice. Please try again later."
    );
  }
};

export const handleNewSubscription = async ({
  ctx,
  subscriptionPrice,
  userId,
  telegramId,
  groupId,
}: Props) => {
  const existingSub = await findExistingSubscription(
    userId,
    groupId,
    Status.ACTIVE
  );

  if (existingSub) {
    return await ctx.reply("✅ You already have an active subscription.");
  }

  const createSub = await createOrRenewSubscription(
    groupId,
    userId,
    telegramId,
    subscriptionPrice
  );
  if (!createSub) {
    return "failed to create Subscription";
  }

  await generateInvoice(ctx, subscriptionPrice, createSub._id);
};

export const handleRenewalInvoice = async (
  ctx: Context,
  subscriptionId: string
) => {
  try {
    const sub = await getSubscription(subscriptionId);
    if (!sub) return "sub not found";
    sub.status = Status.Expired;
    await sub.save();
    const group = await findGroup(sub.groupId);
    if (!group) return "Group not found";
    const createSub = await createOrRenewSubscription(
      sub.groupId,
      sub.userId,
      sub.telegramId,
      group.subscriptionPrice
    );

    if (!createSub) return "Subscription not Created";

    await generateInvoice(ctx, group.subscriptionPrice, createSub?._id);
  } catch (error) {
    console.error("Failed to renew subscription", error);
  }
};
