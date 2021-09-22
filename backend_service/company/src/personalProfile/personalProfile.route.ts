import * as controller from './personalProfile.controller';
import * as express from 'express';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();
router
    .get('/', jwtAuth, setData(), controller.getProfile)
export default router;