import { log } from "console";
import { Request, Response } from "express";

export const telegramAuth = async (req: Request, res: Response) => {
  const { first_name, username, id, photo_url, auth_date, hash } = req.query;

  log(first_name, username, id, photo_url, auth_date, hash);
};
