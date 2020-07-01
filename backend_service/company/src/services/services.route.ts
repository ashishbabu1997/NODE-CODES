import { getServices, addServices } from './services.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addServicesSchema from './schemas/addServicesSchema';

const router = express.Router();

router
    .get('/:companyId', getServices)
    .post('/', validate(addServicesSchema), addServices)

export default router;

