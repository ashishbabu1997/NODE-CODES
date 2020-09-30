import { candidateDetails, listCandidates,approveRejectCandidates,interviewRequest,candidateReview } from './candidates.controller';
import * as express from 'express';
import checkUserRole from '../middlewares/checkUserRole';
import validate from '../middlewares/joiVaildation';
import approveRejectSchema from './schemas/approveRejectSchema';
import interviewRequestSchema from './schemas/interviewRequestSchema';

const router = express.Router();
router
    .get('/candidateDetails', checkUserRole(), candidateDetails)
    .get('/listCandidates', checkUserRole(), listCandidates)
    .post('/candidateApproveReject',validate(approveRejectSchema),approveRejectCandidates)
    .post('/requestForInterview',validate(interviewRequestSchema),interviewRequest)
    .post('/review',candidateReview)
export default router;
