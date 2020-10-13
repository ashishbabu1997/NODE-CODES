import { fetchCertificates, addCertificate, editCertificate, deleteCertificates } from './certificate.controller';
import * as express from 'express';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();

router
    .get('/',jwtAuth, setData(), fetchCertificates)
    .post('/',jwtAuth, setData(), addCertificate)
    .put('/',jwtAuth, setData(), editCertificate)
    .delete('/:certificationId',jwtAuth, setData(), deleteCertificates)

export default router;