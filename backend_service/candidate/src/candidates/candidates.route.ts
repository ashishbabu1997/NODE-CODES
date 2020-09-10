import { candidateDetails, listCandidates } from './candidates.controller';
import * as express from 'express';
import checkUserRole from '../middlewares/checkUserRole';
const router = express.Router();
router
    .get('/candidateDetails', checkUserRole(), candidateDetails)
    .get('/listCandidates', checkUserRole(), listCandidates)
export default router;
