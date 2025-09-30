import mongoose, { model, Schema } from "mongoose";

enum Status {
  PENDING = "pending",
  ACTIVE = "active",
  Expired = "expired",
}

const SubscriptionSchema = new Schema(
  {
    groupId: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    telegramId: { type: String, required: true },
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
