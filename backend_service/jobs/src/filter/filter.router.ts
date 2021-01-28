import * as filterController from './filter.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();
router
    .get('/position',jwtAuth, setData(), filterController.getPositionFilter)
export default router;