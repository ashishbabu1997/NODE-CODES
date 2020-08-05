import { candidateDetails, listCandidates } from './candidates.controller';
import * as express from 'express';
const router = express.Router();
router
    .get('/:candidateId',candidateDetails)
    .get('/',listCandidates)
export default router;
