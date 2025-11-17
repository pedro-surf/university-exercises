import { Request, Response, NextFunction } from "express";
import { verifyJwtAccessToken } from "../jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];

  if (!token || typeof token !== "string") {
    return res.status(401).json({ error: "Missing authorization header" });
  }

  try {
    const decoded = verifyJwtAccessToken(token);
    //@ts-expect-error
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
