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

  for (const member of newMembers) {
    const username = member.username;
    console.log(`New User Joined: ${username}`);
    const welcome = await ctx.reply(`
        👋 Welcome, @${username}!\n\nPlease make sure to follow the group rules:\n1. Be respectful
        \n2. No spam\n3. Follow admin instructions`);

    setTimeout(async () => {
      try {
        await ctx.deleteMessage(welcome.message_id);
        console.log("Welcome message Deleted");
      } catch (error) {
        console.log("Failed to delete welcome message: ", error);
      }
    }, 60000);
  }
});

bot.on("left_chat_member", async (ctx) => {
  try {
    await ctx.deleteMessage(ctx.message.message_id);
    console.log("Deleted left message");
  } catch (err) {
    console.error("Failed to delete left message:", err);
  }
});
