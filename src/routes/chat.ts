import { Response, Router } from "express";
import { CustomRequest, auth } from "../../middleware/auth";
import asyncMiddleware from "../../middleware/async";
import {
  createChat,
  getHistories,
  getHistory,
  updateChat,
} from "../controllers/Chat";

const router = Router();

router.post(
  "/create",
  auth,
  asyncMiddleware((req: CustomRequest, res: Response) => createChat(req, res))
);
router.put(
  "/update/:id",
  auth,
  asyncMiddleware((req: CustomRequest, res: Response) => updateChat(req, res))
);
router.get(
  "/all-histories",
  auth,
  asyncMiddleware((req: CustomRequest, res: Response) => getHistories(req, res))
);
router.get(
  "/history/:id",
  auth,
  asyncMiddleware((req: CustomRequest, res: Response) => getHistory(req, res))
);

export default router;
