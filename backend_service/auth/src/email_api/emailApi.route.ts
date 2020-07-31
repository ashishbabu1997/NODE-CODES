import  * as express from 'express';
import {emailSignup} from "./emailApi.controller"
const router = express.Router();
router
    .post('/',emailSignup)
export default router;