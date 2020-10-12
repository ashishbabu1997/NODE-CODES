import {getJobReceived, getJobReceivedById, updateFlag, updateReject, saveOrSubmitProfile, getProfile,editProfile} from './jobreceived.controller';
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
<<<<<<< HEAD
    .get('/',jwtAuth, setData(), validate(getJobReceivedSchema),getJobReceived)
    .get('/getById',jwtAuth, setData(), validate(getJobReceivedByIdSchema),getJobReceivedById)
    .put('/', jwtAuth, setData(),validate(schemaFlag), updateFlag)
    .put('/reject', jwtAuth, setData(),validate(schemaReject), updateReject)
    .post('/',jwtAuth, setData(),validate(addProfileSchema),saveOrSubmitProfile)
    .put('/editProfiles',jwtAuth, setData(),validate(editprofileSchema),editProfile)
    .get('/profile',jwtAuth, setData(), getProfile)
=======
    .get('/', validate(getJobReceivedSchema),getJobReceived)
    .get('/getById', validate(getJobReceivedByIdSchema),getJobReceivedById)
    .put('/', validate(schemaFlag), updateFlag)
    .put('/reject', validate(schemaReject), updateReject)
    .post('/',validate(addProfileSchema),saveOrSubmitProfile)
    .put('/editProfiles',validate(editprofileSchema),editProfile)
    .get('/profile', getProfile)
>>>>>>> parent of 4f9d780... Revert "Merge branch 'develop' into feature/tokenForCandidates"

export default router;
// validate(editprofileSchema)