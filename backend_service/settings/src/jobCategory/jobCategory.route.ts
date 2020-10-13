import { getJobCategory, addJobCategory, updateJobCategories, deleteJobCategories } from './jobCategory.controller';
import * as express from 'express';
// import validate from '../middlewares/joiVaildation';
// import updateCompanyProfileSchema from './schemas/updateCompanyProfileSchema';
// import updateCompanyMaskingSchema from './schemas/updateCompanyMaskingSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();

router
    .get('/',jwtAuth, setData(), getJobCategory)
    .post('/',jwtAuth, setData(), addJobCategory)
    .put('/',jwtAuth, setData(), updateJobCategories)
    .delete('/:jobCategoryId',jwtAuth, setData(), deleteJobCategories)
export default router;