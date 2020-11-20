import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
import * as freelancerController from './freelancer.controller';

const router = express.Router();
router
    .put('/updateGeneralInfo',jwtAuth, setData(), freelancerController.updateGeneralInfo)
    .put('/updateOtherInfoAndSubmit',jwtAuth, setData(), freelancerController.updateOtherInfoAndSubmit)
export default router;
