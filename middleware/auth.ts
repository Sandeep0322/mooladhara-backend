import { Request, Response, NextFunction } from "express";
import firebaseAdmin from "firebase-admin";
import Users, { UsersDocument } from "../src/models/Users";

export interface CustomRequest extends Request {
  user: UsersDocument;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const user = await Users.findOne({ authTokens: { $in: [authToken] } });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const customReq = req as CustomRequest;
    customReq.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token", error });
  }
};
