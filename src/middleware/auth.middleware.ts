import { NextFunction, Response } from "express";
import { AuthReq } from "../types/auth.type";
import { verifyToken } from "../utils/jwtUtils";

const authMiddleWare = async (
  req: AuthReq,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decode = verifyToken(token);
    if (!decode) {
      return res.status(403).json({ message: "Token verification failed" });
    }
    req.user = decode;
    next();
  } catch (error) {
    console.error("Token error: ", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleWare;
