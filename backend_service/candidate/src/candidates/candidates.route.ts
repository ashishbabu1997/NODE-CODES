import { candidateDetails, listCandidates,approveRejectCandidates,interviewRequest,candidateReview } from './candidates.controller';
import * as express from 'express';
import checkUserRole from '../middlewares/checkUserRole';
const router = express.Router();
router
    .get('/candidateDetails', checkUserRole(), candidateDetails)
    .get('/listCandidates', checkUserRole(), listCandidates)
    .post('/candidateApproveReject',approveRejectCandidates)
    .post('/requestForInterview',interviewRequest)
    .post('/review',candidateReview)
export default router;
