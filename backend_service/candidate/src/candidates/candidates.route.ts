import { candidateDetails, listCandidates,approveRejectCandidates } from './candidates.controller';
import * as express from 'express';
import checkUserRole from '../middlewares/checkUserRole';
const router = express.Router();
router
    .get('/candidateDetails', checkUserRole(), candidateDetails)
    .get('/listCandidates', checkUserRole(), listCandidates)
    .post('/candidateApproveReject',approveRejectCandidates)
export default router;
