import { Response, Router } from 'express'
import { createUsers, updateUsers, getUsers } from '../controllers/User'
import { CustomRequest, auth } from '../../middleware/auth'
import asyncMiddleware from '../../middleware/async'

const router = Router()

router.post(
  '/create',
  asyncMiddleware((req: CustomRequest, res: Response) => createUsers(req, res))
)
router.put(
  '/update',
  auth,
  asyncMiddleware((req: CustomRequest, res: Response) => updateUsers(req, res))
)
router.get(
  '/getUser',
  auth,
  asyncMiddleware((req: CustomRequest, res: Response) => getUsers(req, res))
)

export default router
