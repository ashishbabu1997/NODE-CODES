import AppConfig from './config/config';
import emailRouter from './email_api/emailApi.route';
import otpRouter from './otpValidate/otpValidate.route';
import loginRouter from './employeeLogin/EmployeeLoginRoute';
import resetPasswordRouter from './passwordReset/passwordReset.route'
import * as  express from 'express';
const router = express.Router();
router
    .use(`/api/${AppConfig.version}/signup/emailSignup`, emailRouter)
    .use(`/api/${AppConfig.version}/signup/resetPassword`, resetPasswordRouter)
    .use(`/api/${AppConfig.version}/signup/otpvalidation`, otpRouter)
    .use(`/api/${AppConfig.version}/login`, loginRouter)

export default router;
