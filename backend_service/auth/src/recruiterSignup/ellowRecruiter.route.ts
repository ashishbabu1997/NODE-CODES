import * as express from 'express';
import * as ellowRecruiterController from "./ellowRecruiter.controller"
const router = express.Router();
router
    .get('/:style',ellowRecruiterController.recruiterGetSignup)
    .post('/signup',ellowRecruiterController.recruiterPostSignup)

export default router;