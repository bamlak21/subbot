import { Types } from "mongoose";
import { Subscription } from "../models/subscription.model";
import { Status } from "../types/subscription.type";

export const createOrRenewSubscription = async (
  groupId: string,
  userId: Types.ObjectId,
  telegramId: number,
  subscriptionPrice: number
) => {
  if (!groupId || !userId || !telegramId || !subscriptionPrice) {
    console.error("Missing required field");
  }
  const now = new Date();
  let newExpiry = new Date();

  try {
    const latestExpiry = await findSubscription(userId, groupId);

    if (
      latestExpiry &&
      typeof latestExpiry !== "string" &&
      latestExpiry.expiryAt
    ) {
      const baseDate =
        latestExpiry.expiryAt > now ? latestExpiry.expiryAt : now;
      newExpiry.setTime(baseDate.getTime());
      newExpiry.setMonth(newExpiry.getMonth() + 1);
    } else {
      newExpiry.setMonth(newExpiry.getMonth() + 1);
    }

    const newSub = await Subscription.create({
      groupId: groupId,
      userId: userId,
      telegramId: telegramId,
      status: Status.PENDING,
      expiryAt: newExpiry,
    });

    return newSub;
  } catch (error) {
    console.error("Failed to create new Subscription", error);
  }
};

export const findExistingSubscription = async (
  userId: Types.ObjectId,
  groupId: string,
  status?: string
) => {
  if (!userId || !groupId) {
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

export const findSubscription = async (
  userId: Types.ObjectId,
  groupId: string
) => {
  if (!userId || !groupId) {
    return "Missing required fields";
  }
  try {
    const sub = await Subscription.findOne({ userId, groupId });

    if (!sub) return "Failed to find subscription";

    return sub;
  } catch (error) {
    console.error(error);
  }
};

export const markSubscriptionPaid = async (subscriptionId: string) => {
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

export const getSubscription = async (id: string) => {
  try {
    return await Subscription.findById(id);
  } catch (error) {
    console.error("Failed to find subscription: ", error);
  }
};

export const getExpiringSubscriptions = async (daysBefore: number = 3) => {
  try {
    const expiringSubs = await Subscription.find({ status: Status.ACTIVE });
    const expiring = [];
    for (const sub of expiringSubs) {
      if (!sub.expiryAt) {
        console.warn(`❗ No expireAt date found for user ${sub.telegramId}`);
        return;
      }

      const now = new Date();
      const diff = sub.expiryAt.getTime() - now.getTime();
      const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

      if (daysLeft <= daysBefore && daysLeft > 0) {
        expiring.push({ sub, daysLeft, type: "reminder" });
      } else if (daysLeft <= 0) {
        expiring.push({ sub, daysLeft, type: "expired" });
      }
    }

    return expiring;
  } catch (error) {
    console.error(error);
  }
};

export const checkNewUserSubscription = async (telegramId: number) => {
  try {
    const subs = await Subscription.find({ telegramId });
    if (!subs) return false;
    else return true;
  } catch (error) {
    console.error("Failed to look up subscription", error);
  }
};
