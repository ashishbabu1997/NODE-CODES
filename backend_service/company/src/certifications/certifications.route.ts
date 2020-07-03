import { getCertifications, addCertifications, updateCertifications, deleteCertifications } from './certifications.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addCertificationSchema from './schemas/addCertificationSchema';
import updateCertificationSchema from './schemas/updateCertificationSchema';

const router = express.Router();

router
    .get('/:companyId', getCertifications)
    .post('/', validate(addCertificationSchema), addCertifications)
    .put('/',validate(updateCertificationSchema), updateCertifications)
    .delete('/:companycertificationId', deleteCertifications)

export default router;