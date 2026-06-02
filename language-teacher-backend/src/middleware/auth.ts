import { Request, Response, NextFunction } from "express";

const API_TOKEN = process.env.API_TOKEN;

export function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization =
    req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: "Missing authorization header",
    });
  }

  const [scheme, token] =
    authorization.split(" ");

  if (scheme !== "Bearer") {
    return res.status(401).json({
      message: "Invalid authorization scheme",
    });
  }

  if (token !== API_TOKEN) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  next();
}