import AppConfig from './config/config';
import emailRouter from './email_api/emailApi.route';
import otpRouter from './otpValidate/otpValidate.route'
import * as  express from 'express';
const router = express.Router();
router
    .use(`/api/${AppConfig.version}/signup/sendMail`, emailRouter)
    .use(`/api/${AppConfig.version}/signup/otpvalidation`, otpRouter)
export default router;
