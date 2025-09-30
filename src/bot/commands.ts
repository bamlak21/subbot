import { FindOrCreateUser } from "../services/user.service";
import { bot } from "./index";

bot.start(async (ctx) => {
  const { id, first_name, username } = ctx.from;
  const groupId = ctx.message.text.split(" ")[1];

  if (!username) {
    return "username undefined";
  }

  const user = await FindOrCreateUser(id, username, first_name);

  await ctx.reply(`Welcome to ${groupId}`);
});
