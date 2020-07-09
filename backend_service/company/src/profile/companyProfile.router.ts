import { getDetails,updateDetails } from './companyProfile.controller';
import * as express from 'express';
import validate from '../middlewares/joiValidation';
import updateDetailsSchema from './schemas/updateDetailsSchema';
const router = express.Router();
router
    .get('/:compny_id',getDetails)
    .put('/update_details', validate(updateDetailsSchema), updateDetails)
export default router;