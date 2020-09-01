import { candidateDetails, listCandidates } from './candidates.controller';
import * as express from 'express';
const router = express.Router();
router
    .get('candidateDetails/:candidateId',candidateDetails)
    .get('listCandidates/',listCandidates)
export default router;
