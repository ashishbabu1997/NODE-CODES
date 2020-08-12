import  * as express from 'express';
import {resetPwd} from "./passwordReset.controller"
const router = express.Router();
router
    .post('/',resetPwd);
export default router;