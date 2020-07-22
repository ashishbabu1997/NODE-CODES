import { updateCompanyProfile, getCompanyPreferences, enableCompanyMasking } from './preferences.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import updateCompanyProfileSchema from './schemas/updateCompanyProfileSchema';
import updateCompanyMaskingSchema from './schemas/updateCompanyMaskingSchema';

const router = express.Router();

router
    .get('/:companyId', getCompanyPreferences)
    .put('/companyProfile', validate(updateCompanyProfileSchema), updateCompanyProfile)
    .put('/enableMasking', validate(updateCompanyMaskingSchema), enableCompanyMasking)

export default router;

