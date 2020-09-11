import {getJobReceived, getJobReceivedById, updateFlag, updateReject, saveOrSubmitProfile, getProfile,editProfile} from './jobreceived.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addProfileSchema from './schemas/addProfileSchema';
import {schemaFlag, schemaReject} from './schemas/flagOrRejectSchema';
import editprofileSchema from './schemas/editprofileSchema'
const router = express.Router();


router
    .get('/', getJobReceived)
    .get('/getById', getJobReceivedById)
    .put('/', validate(schemaFlag), updateFlag)
    .put('/reject', validate(schemaReject), updateReject)
    .post('/',saveOrSubmitProfile)
    .put('/editProfiles',validate(editprofileSchema),editProfile)
    .get('/profile', getProfile)

export default router;