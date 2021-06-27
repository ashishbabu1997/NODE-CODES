import * as companyProfileController from './companyProfile.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import updateDetailsSchema from './schemas/updateDetailsSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();
router
    .get('/', jwtAuth, setData(), companyProfileController.getDetails)
    .put('/updateCompanyProfile', jwtAuth, setData(), validate(updateDetailsSchema), companyProfileController.updateDetails)
    .put('/updateProfileLogo', jwtAuth, setData(), companyProfileController.updateLogoAndProfile)
    .get('/preferences', jwtAuth, setData(), companyProfileController.getPreferences)
    .put('/updatePreferences', jwtAuth, setData(), companyProfileController.updatePreferences)
export default router;