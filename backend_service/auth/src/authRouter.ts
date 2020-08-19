import AppConfig from './config/config';
import emailRouter from './email_api/emailApi.route';
import otpRouter from './otpValidate/otpValidate.route';
import loginRouter from './employeeLogin/EmployeeLoginRoute';
import forgotPasswordRouter from './forgotPassword/forgotPassword.route'
import changePasswordRouter from './resetPassword/resetPassword.route'
import resetPasswordRouter from './changeP/changePassword.route'
import resendOtpRouter from './resendOtp/resendOtp.route'
import * as  express from 'express'
const router = express.Router();
router
    .use(`/api/${AppConfig.version}/signup/emailSignup`, emailRouter)
    .use(`/api/${AppConfig.version}/signup/forgotPassword`, forgotPasswordRouter)
    .use(`/api/${AppConfig.version}/signup/changePassword`, changePasswordRouter)
    .use(`/api/${AppConfig.version}/signup/resetPassword`, resetPasswordRouter)
    .use(`/api/${AppConfig.version}/signup/resendOtp`, resendOtpRouter)
    .use(`/api/${AppConfig.version}/signup/otpvalidation`, otpRouter)
    .use(`/api/${AppConfig.version}/login`, loginRouter)

export default router;
