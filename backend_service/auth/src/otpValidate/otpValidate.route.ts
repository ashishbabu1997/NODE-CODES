import  * as express from 'express';
import {otpCheck} from "./otpValidate.controller"
import validate from '../middlewares/joiValidation';
import otpValidateSchema from './schemas/otpValidateSchema';
const router = express.Router();
router
    .post('/',validate(otpValidateSchema),otpCheck)
export default router;