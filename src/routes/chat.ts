import { Response, Router } from "express";
import { CustomRequest, auth } from "../../middleware/auth";
import asyncMiddleware from "../../middleware/async";
import { createChat, getHistory, updateChat } from "../controllers/Chat";

const router = Router();

router.post(
  "/create",
  asyncMiddleware((req: CustomRequest, res: Response) => createChat(req, res))
);
router.put(
  "/update",
  auth,
  asyncMiddleware((req: CustomRequest, res: Response) => updateChat(req, res))
);
router.get(
  "/history",
  auth,
  asyncMiddleware((req: CustomRequest, res: Response) => getHistory(req, res))
);

export default router;
