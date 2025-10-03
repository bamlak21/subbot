import { Context } from "telegraf";
import { Groups } from "../models/groups.model";
import { bot } from "../bot";
import axios from "axios";

export const findGroup = async (groupId: string) => {
  try {
    return await Groups.findOne({ groupId });
  } catch (error) {
    console.error(error);
  }
};

export const sendGroupPhoto = async (ctx: Context, groupId: string) => {
  console.log(groupId);

  try {
    const chat = await bot.telegram.getChat(`-${groupId}`); // use the group Telegram ID
    let photoUrl: string | null = null;
    if (chat.photo) {
      const file = await bot.telegram.getFile(chat.photo.big_file_id);
      photoUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
    }
    if (!photoUrl) return "No photo found";
    const response = await axios(photoUrl, { responseType: "stream" });

    // Send group photo
    if (!response) {
      await ctx.reply(`🎟 Your invoice for joining `, {
        parse_mode: "Markdown",
      });
    } else {
      await ctx.replyWithPhoto(
        { source: response.data },
        { caption: "Welcome to the group" }
      );
    }
  } catch (error) {
    console.error(error);
  }
};
