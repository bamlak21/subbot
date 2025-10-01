import mongoose, { model, Schema } from "mongoose";
import { Status } from "../types/subscription.type";

const SubscriptionSchema = new Schema(
  {
    groupId: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    telegramId: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.PENDING,
    },
    expiryAt: Date,
  },
  {
    timestamps: true,
  }
);

export const Subscription = model("Subscription", SubscriptionSchema);
