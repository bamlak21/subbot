import { User } from "../model/user.model";

export const FindOrCreateUser = async (
  telegramId: number,
  username: string,
  first_name: string
) => {
  let user = await User.findOne({ telegramId });

  if (!user) {
    user = await User.create({
      telegramId: telegramId,
      username: username,
      firstName: first_name,
    });
  }

  return user;
};
