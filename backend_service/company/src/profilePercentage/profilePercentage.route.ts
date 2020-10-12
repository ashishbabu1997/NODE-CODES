import { getProfilePercentage } from './profilePercentage.controller';
import * as express from 'express';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();
router
    .get('/', jwtAuth, setData(), getProfilePercentage)
export default router;