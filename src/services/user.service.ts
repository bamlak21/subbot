import { IUser, User } from "../models/user.model";

export const findUser = async (telegramId: number) => {
  try {
    return await User.findOne({ telegramId });
  } catch (error) {
    console.error(error);
  }
};

export const findOrCreateUser = async (
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

export const getAllUsersAdmin = async (
  page: number,
  limit: number,
  search: string
) => {
  const query = search
    ? {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  try {
    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    const total = await User.countDocuments(query);
    return { total, page, limit, users };
  } catch (error) {
    console.error("Failed to get all users: ", error);
  }
};

export const getUser = async (id: string) => {
  if (!id) {
    console.error("Id not found");
  }
  try {
    return await User.findById(id).lean();
  } catch (error) {
    console.error("Failed to get user", error);
  }
};

export const deleteUserAdmin = async (id: string) => {
  try {
    return await User.findByIdAndDelete({ _id: id });
  } catch (error) {
    console.error("Failed to delete User: ", error);
    throw error;
  }
};

export const updateUserAdmin = async (id: string, data: Partial<IUser>) => {
  try {
    return await User.findByIdAndUpdate(id, data, { new: true }).lean();
  } catch (error) {
    console.error("Failed to update user: ", error);
    throw error;
  }
};
