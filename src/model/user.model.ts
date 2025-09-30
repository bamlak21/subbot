import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    telegramId: { type: Number, required: true, unique: true },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = model("User", UserSchema);
