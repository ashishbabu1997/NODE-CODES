import { updateCompanyProfile, getCompanyPreferences, enableCompanyMasking } from './preferences.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import updateCompanyProfileSchema from './schemas/updateCompanyProfileSchema';
import updateCompanyMaskingSchema from './schemas/updateCompanyMaskingSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();

router
    .get('/:companyId',jwtAuth, setData(), getCompanyPreferences)
    .put('/companyProfile',jwtAuth, setData(),validate(updateCompanyProfileSchema), updateCompanyProfile)
    .put('/enableMasking',jwtAuth, setData(), validate(updateCompanyMaskingSchema), enableCompanyMasking)

export default router;

