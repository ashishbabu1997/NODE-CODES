import { getDomains, addDomains, updateDomains, deleteDomain } from './DomainsController';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import updateCompanyProfileSchema from './schemas/updateCompanyProfileSchema';
import updateCompanyMaskingSchema from './schemas/updateCompanyMaskingSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();

router
    .get('/',jwtAuth, setData(), getDomains)
    .post('/', jwtAuth, setData(),addDomains)
    .put('/',jwtAuth, setData(), updateDomains)
    .delete('/:domainId',jwtAuth, setData(), deleteDomain)
export default router;

