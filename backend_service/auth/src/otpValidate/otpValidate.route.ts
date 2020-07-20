import  * as express from 'express';
import {validateOtp} from "./otpValidate.controller"
import validate from '../middlewares/joiValidation';
import otpValidateSchema from './schemas/otpValidateSchema';
const router = express.Router();
router
    .post('/',validate(otpValidateSchema),validateOtp)
export default router;