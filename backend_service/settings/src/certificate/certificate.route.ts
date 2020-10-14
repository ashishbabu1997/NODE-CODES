import { fetchCertificates, addCertificate, editCertificate, deleteCertificates } from './certificate.controller';
import * as express from 'express';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();

router
    .get('/', fetchCertificates)
    .post('/',addCertificate)
    .put('/', editCertificate)
    .delete('/:certificationId', deleteCertificates)

export default router;