import { Request } from "express";
import { Types } from "mongoose";
export type jwtPayload = {
  id: Types.ObjectId | undefined;
  telegramId: number | undefined;
};

export interface AuthReq extends Request {
  user?: jwtPayload | null;
}
