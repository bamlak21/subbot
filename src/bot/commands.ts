import { findGroup, sendGroupPhoto } from "../services/groups.service";
import { handleNewSubscription } from "../services/payment.service";
import { findOrCreateUser } from "../services/user.service";
import { bot } from "./index";

bot.start(async (ctx) => {
  const { id, first_name, username } = ctx.from;
  if (!username) return "username undefined";

  // extract the ID for the telegram group from the starting parameter
  const groupId = ctx.message.text.split(" ")[1];
  if (!groupId) await ctx.reply("No Group Id found!");

  try {
    const user = await findOrCreateUser(id, username, first_name);
    if (!user) return "User Not Found";
    const group = await findGroup(groupId);
    if (!group) return "Group Not Found";

    await sendGroupPhoto(ctx, groupId);
    await handleNewSubscription({
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
