import * as dashboardController from './dashboard.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();
router
    .get('/counts',jwtAuth, setData(), dashboardController.getCounts)
    .get('/upcomingInterviews',jwtAuth, setData(), dashboardController.fetchupcomingInterviews)

    
export default router;