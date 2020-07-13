import { getDetails,updateDetails } from './companyProfile.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import updateDetailsSchema from './schemas/updateDetailsSchema';
const router = express.Router();
router
    .get('/:companyId',getDetails)
    .put('/updateDetails', validate(updateDetailsSchema), updateDetails)
export default router;