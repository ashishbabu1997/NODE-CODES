import  * as express from 'express';
import {resendOtp} from "./resendOtp.controller"
const router = express.Router();
router
    .post('/',resendOtp)
export default router;