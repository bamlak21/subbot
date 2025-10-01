import { User } from "../models/user.model";

export const FindUser = async (telegramId: number) => {
  try {
    return await User.findOne({ telegramId });
  } catch (error) {
    console.error(error);
  }
};

export const FindOrCreateUser = async (
  telegramId: number,
  username: string,
  first_name: string
) => {
  try {
    let user = await User.findOne({ telegramId });

    if (!user) {
      user = await User.create({
        telegramId: telegramId,
        username: username,
        firstName: first_name,
      });
    }

    return user;
  } catch (error) {
    console.error(error);
  }
};
