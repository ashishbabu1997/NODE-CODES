import  * as express from 'express';
import {resetPassword} from "./changePassword.controller"
const router = express.Router();
router
    .post('/',resetPassword)
export default router;