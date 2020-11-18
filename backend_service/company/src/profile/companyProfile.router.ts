import { getDetails, updateDetails } from './companyProfile.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import updateDetailsSchema from './schemas/updateDetailsSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();
router
    .get('/', jwtAuth, setData(), getDetails)
    .put('/updateCompanyProfile', jwtAuth, setData(), validate(updateDetailsSchema), updateDetails)
export default router;