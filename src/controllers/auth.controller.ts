import { Request, Response } from "express";
import { urlStrToAuthDataMap, AuthDataValidator } from "@telegram-auth/server";
import { config } from "../config";
import { findOrCreateUser } from "../services/user.service";
import { generateToken } from "../utils/jwtUtils";
import { log } from "console";

export const telegramAuth = async (req: Request, res: Response) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

  log("URL: ", fullUrl);

  const authData = urlStrToAuthDataMap(fullUrl);
  log("Auth data", authData);

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
