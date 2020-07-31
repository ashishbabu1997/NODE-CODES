import { fetchCertificates, addCertificate, editCertificate, deleteCertificates } from './certificate.controller';
import * as express from 'express';

const router = express.Router();

router
    .get('/', fetchCertificates)
    .post('/', addCertificate)
    .put('/', editCertificate)
    .delete('/:certificationId', deleteCertificates)

export default router;