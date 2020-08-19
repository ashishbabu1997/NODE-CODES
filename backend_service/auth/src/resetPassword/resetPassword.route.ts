import  * as express from 'express';
import {changePassword} from "./resetPassword.controller"
const router = express.Router();
router
    .post('/',changePassword)
export default router;