import { checkNewUserSubscription } from "../../services/subscription.service";
import { bot } from "../index";

bot.on("new_chat_members", async (ctx) => {
  try {
    await ctx.deleteMessage(ctx.message.message_id);
    console.log("Deleted join message");
  } catch (err) {
    console.error("Failed to delete join message:", err);
  }

  const newMembers = ctx.message.new_chat_members;
  for (const member of newMembers) {
    const subExists = await checkNewUserSubscription(member.id);
    if (!subExists) {
      await Promise.all([
        ctx.kickChatMember(member.id),
        ctx.unbanChatMember(member.id),
      ]);
      console.log(`Removed ${member.first_name} for not paying.`);
    }
  }
});
