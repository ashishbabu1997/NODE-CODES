import { getServiceTypes, addServices, updateServices, deleteServices } from './ServicesController';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import updateCompanyProfileSchema from './schemas/updateCompanyProfileSchema';
import updateCompanyMaskingSchema from './schemas/updateCompanyMaskingSchema';

const router = express.Router();

router
    .get('/', getServiceTypes)
    .post('/', addServices)
    .put('/', updateServices)
    .delete('/:serviceId', deleteServices)

export default router;

