import {getJobReceived,getJobReceivedById, updateReject, addProfile, submitProfile,getProfile,skillEdits} from './jobreceived.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import {schemaReject} from './schemas/flagOrRejectSchema';
import {getJobReceivedSchema, getJobReceivedByIdSchema} from './schemas/getJobSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();
router
    .get('/',jwtAuth, setData(), validate(getJobReceivedSchema),getJobReceived)
    .get('/getById',jwtAuth, setData(), validate(getJobReceivedByIdSchema),getJobReceivedById)
    .put('/reject', jwtAuth, setData(),validate(schemaReject), updateReject)
    .post('/addProfile',jwtAuth, setData(),addProfile)
    .put('/submitProfile',jwtAuth, setData(),submitProfile)
    .put('/editSkills',jwtAuth, setData(),skillEdits)
    .get('/profile',jwtAuth, setData(), getProfile)
    // .get('/allJobsSkills',jwtAuth, setData(), getAllJobSkills)

export default router;