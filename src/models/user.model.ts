import { model, Schema } from "mongoose";

export interface IUser {
  username: String;
  firstName: String;
  telegramId: Number;
  balance: Number;
}

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
