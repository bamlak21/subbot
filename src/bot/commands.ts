import { FindGroup } from "../services/groups.service";
import { CreateInvoice } from "../services/payment.service";
import {
  CreateSubscription,
  FindExistingSubscription,
} from "../services/subscription.service";
import { FindOrCreateUser } from "../services/user.service";
import { Status } from "../types/subscription.type";
import { bot } from "./index";

bot.start(async (ctx) => {
  const { id, first_name, username } = ctx.from;
  if (!username) return "username undefined";

  // extract the ID for the telegram group from the starting parameter
  const groupId = ctx.message.text.split(" ")[1];
  if (!groupId) await ctx.reply("No Group Id found!");

  try {
    const user = await FindOrCreateUser(id, username, first_name);
    if (!user) return "User Not Found";
    const group = await FindGroup(groupId);
    if (!group) return "Group Not Found";

    await CreateInvoice({
      ctx,
      subscriptionPrice: group.subscriptionPrice,
      userId: user._id,
      telegramId: id,
      groupId,
    });
  } catch (error) {
    console.error(error);
  }
});
