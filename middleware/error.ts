import { NextFunction, Request, Response } from "express";

export default function error(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Logging to file
  console.log(err.message, err);
  res.status(500).json({ error: "Internal Server Error" });
  next();
}
