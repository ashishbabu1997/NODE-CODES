import { getJobCategory, addJobCategory, updateJobCategories, deleteJobCategories } from './jobCategory.controller';
import * as express from 'express';
// import validate from '../middlewares/joiVaildation';
// import updateCompanyProfileSchema from './schemas/updateCompanyProfileSchema';
// import updateCompanyMaskingSchema from './schemas/updateCompanyMaskingSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();

router
    .get('/', getJobCategory)
    .post('/', addJobCategory)
    .put('/', updateJobCategories)
    .delete('/:jobCategoryId', deleteJobCategories)
export default router;