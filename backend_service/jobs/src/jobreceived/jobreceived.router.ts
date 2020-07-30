import {getJobReceived, getJobReceivedById, updateFlag, updateReject, submitProfile, getProfile, saveProfile} from './jobreceived.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addProfileSchema from './schemas/addProfileSchema';
import {schemaFlag, schemaReject} from './schemas/flagOrRejectSchema';

const router = express.Router();


router
    .get('/', getJobReceived)
    .get('/job/:jobReceivedId/:sellerCompanyId', getJobReceivedById)
    .put('/', validate(schemaFlag), updateFlag)
    .put('/reject', validate(schemaReject), updateReject)
    .post('/submit', validate(addProfileSchema),submitProfile)
    .post('/save', validate(addProfileSchema),saveProfile)
    .get('/profile/:companyId', getProfile)

export default router;