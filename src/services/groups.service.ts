import { Groups } from "../models/groups.model";

export const findGroup = async (groupId: string) => {
  try {
    return await Groups.findOne({ groupId });
  } catch (error) {
    console.error(error);
  }
};
