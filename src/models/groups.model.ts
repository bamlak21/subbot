import { model, Schema } from "mongoose";

const GroupSchema = new Schema(
  {
    groupId: { type: String, required: true, unique: true },
    subscriptionPrice: { type: Number, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    revenue: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Groups = model("Groups", GroupSchema);
