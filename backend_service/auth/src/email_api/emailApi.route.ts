
import * as express from 'express';
import {getEmail} from "./emailApi.controller"
const router = express.Router();
router
    .post('/',getEmail)
export default router;