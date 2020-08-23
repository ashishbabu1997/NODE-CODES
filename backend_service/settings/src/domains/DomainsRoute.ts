import { getDomains, addDomains, updateDomains, deleteDomain } from './DomainsController';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import updateCompanyProfileSchema from './schemas/updateCompanyProfileSchema';
import updateCompanyMaskingSchema from './schemas/updateCompanyMaskingSchema';

const router = express.Router();

router
    .get('/', getDomains)
    .post('/', addDomains)
    .put('/', updateDomains)
    .delete('/:domainId', deleteDomain)
export default router;

