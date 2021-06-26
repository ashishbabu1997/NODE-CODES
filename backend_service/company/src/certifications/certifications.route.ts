import { getCertifications, addCertifications, updateCertifications, deleteCertifications } from './certifications.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addCertificationSchema from './schemas/addCertificationSchema';
import updateCertificationSchema from './schemas/updateCertificationSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';

const router = express.Router();

router
    .get('/', jwtAuth, setData(), getCertifications)
    .post('/', jwtAuth, setData(), validate(addCertificationSchema), addCertifications)
    .put('/', jwtAuth, setData(), validate(updateCertificationSchema), updateCertifications)
    .delete('/:companyCertificationId', jwtAuth, setData(), deleteCertifications)

export default router;