import {getJobReceived, getJobReceivedById, updateFlag, updateReject, saveOrSubmitProfile, getProfile,editProfile,skillEdits} from './jobreceived.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addProfileSchema from './schemas/addProfileSchema';
import {schemaFlag, schemaReject} from './schemas/flagOrRejectSchema';
import {getJobReceivedSchema, getJobReceivedByIdSchema} from './schemas/getJobSchema';
import editprofileSchema from './schemas/editprofileSchema'
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();


router
    .get('/',jwtAuth, setData(), validate(getJobReceivedSchema),getJobReceived)
    .get('/getById',jwtAuth, setData(), validate(getJobReceivedByIdSchema),getJobReceivedById)
    .put('/', jwtAuth, setData(),validate(schemaFlag), updateFlag)
    .put('/reject', jwtAuth, setData(),validate(schemaReject), updateReject)
    .post('/',jwtAuth, setData(),validate(addProfileSchema),saveOrSubmitProfile)
    .put('/editProfiles',jwtAuth, setData(),validate(editprofileSchema),editProfile)
    .put('/editSkills',jwtAuth, setData(),skillEdits)
    .get('/profile',jwtAuth, setData(), getProfile)
export default router;
// validate(editprofileSchema)