import { Request } from "express";
import jwt from "jsonwebtoken";
import { jwtPayload } from "../types/auth.type";
import { config } from "../config";

export const generateToken = (payload: jwtPayload) => {
  return jwt.sign(payload, config.secret, { expiresIn: "40h" });
};

export const verifyToken = (token: string): jwtPayload | null => {
  try {
    const decoded = jwt.verify(token, config.secret) as jwtPayload;
    return decoded;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};
