import { getServices, addServices } from './services.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addServicesSchema from './schemas/addServicesSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';

const router = express.Router();

router
    .get('/', jwtAuth, setData(), getServices)
    .post('/', jwtAuth, setData(), validate(addServicesSchema), addServices)

export default router;

