import { Request, Response } from "express";
import { urlStrToAuthDataMap, AuthDataValidator } from "@telegram-auth/server";
import { config } from "../config";
import { findOrCreateUser, findUser } from "../services/user.service";
import { generateToken } from "../utils/jwtUtils";
import { log } from "console";
import { AuthReq } from "../types/auth.type";

export const telegramAuth = async (req: Request, res: Response) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

  const authData = urlStrToAuthDataMap(fullUrl);

  const validator = new AuthDataValidator({
    botToken: config.bot,
  });

  const user = await validator.validate(authData);

  if (!user) {
  }

  const dbUser = await findOrCreateUser(
    user.id,
    user.username || "",
    user.first_name
  );

  let payload = {
    id: dbUser?._id,
    telegramId: dbUser?.telegramId,
  };

  const token = generateToken(payload);

  return res.redirect(
    `https://subbot-dash.bamlak.dev/auth/success?token=${token}`
  );
};

export const userDetails = async (req: AuthReq, res: Response) => {
  const user = req.user;
  log(user);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  if (typeof user.telegramId !== "number") {
    return res.status(400).json({ message: "invalid or missing telegramId" });
  }

  try {
    const userDetails = await findUser(user.telegramId);
    log(userDetails);
    return res
      .status(200)
      .json({
        id: userDetails?._id,
        fistName: userDetails?.firstName,
        username: userDetails?.username,
        balance: userDetails?.balance,
      });
  } catch (error) {
    console.log("Fetching user details failed", error);
    return res.status(500).json({ message: "failed to fetch user details" });
  }
};
