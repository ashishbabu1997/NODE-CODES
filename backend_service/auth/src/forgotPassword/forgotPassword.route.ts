import  * as express from 'express';
import {resetPwd} from "./forgotPassword.controller"
const router = express.Router();
router
    .post('/',resetPwd);
export default router;