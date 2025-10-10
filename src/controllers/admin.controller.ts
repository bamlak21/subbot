import { Request, Response } from "express";
import {
  deleteUserAdmin,
  getAllUsersAdmin,
  getUser,
  updateUserAdmin,
} from "../services/user.service";
import { parsePagination } from "../utils/pagination";
import { getAllGroupsAdmin, getGroupAdmin } from "../services/groups.service";

// ---------- USER MANAGEMENT ----------

export const getAllUsers = async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(
    req.query.page as string,
    req.query.limit as string
  );

  try {
    const users = await getAllUsersAdmin(
      page,
      limit,
      (req.query.search as string) || ""
    );
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Failed to fetch Users: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const user = await getUser(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Failed to fetch user: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    await deleteUserAdmin(id);
    return res
      .status(200)
      .json({ success: true, message: "user deleted successfully" });
  } catch (error) {
    console.error("failed to delete user: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  if (!id || !Object.keys(data).length) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const updatedUser = await updateUserAdmin(id, data);
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }
};

// ---------- GROUP MANAGEMENT ----------
export const getAllGroups = async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(
    req.query.page as string,
    req.query.limit as string
  );

  try {
    const groups = await getAllGroupsAdmin(
      page,
      limit,
      (req.query.search as string) || ""
    );

    return res.status(200).json({ success: true, data: groups });
  } catch (error) {
    console.error("Failed to fetch users");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getGroupById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const group = await getGroupAdmin(id);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }
    return res.status(200).json({ success: true, data: group });
  } catch (error) {
    console.error("Failed to get group by id: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server Error" });
  }
};
