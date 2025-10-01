import { Types } from "mongoose";
import { Subscription } from "../models/subscription.model";
import { Status } from "../types/subscription.type";

export const CreateSubscription = async (
  groupId: string,
  userId: Types.ObjectId,
  telegramId: number,
  subscriptionPrice: number
) => {
  if (!groupId || !userId || !telegramId || !subscriptionPrice) {
    console.error("Missing required field");
  }

  try {
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);
    const sub = await Subscription.create({
      groupId: groupId,
      userId: userId,
      telegramId: telegramId,
      status: Status.PENDING,
      expiryAt: expiry,
    });

    return sub;
  } catch (error) {
    console.error(error);
  }
};

export const FindExistingSubscription = async (
  userId: Types.ObjectId,
  groupId: string,
  status: string
) => {
  if (!userId || !groupId || !status) {
    return "Missing required fields";
  }
  try {
    const sub = await Subscription.findOne({ userId, groupId, status });
    if (sub) return true;
    else return false;
  } catch (error) {
    console.error(error);
  }
};

export const MarkSubscriptionPaid = async (subscriptionId: string) => {
  try {
    return await Subscription.findByIdAndUpdate(
      subscriptionId,
      { status: Status.ACTIVE },
      { new: true }
    );
  } catch (error) {
    console.error("Failed to update subscription:", error);
    throw error;
  }
};
