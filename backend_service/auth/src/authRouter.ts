import AppConfig from './config/config';
import loginRouter from './employeeLogin/EmployeeLoginRoute';
import forgotPasswordRouter from './forgotPassword/forgotPassword.route'
import changePasswordRouter from './changePassword/changePassword.route'
import resetPasswordRouter from './resetPassword/resetPassword.route'
import ellowRecruiterRouter from './recruiterSignup/ellowRecruiter.route'

import * as  express from 'express'
const router = express.Router();
router
    
    .use(`/api/${AppConfig.version}/signup/forgotPassword`, forgotPasswordRouter)
    .use(`/api/${AppConfig.version}/signup/changePassword`, changePasswordRouter)
    .use(`/api/${AppConfig.version}/signup/resetPassword`, resetPasswordRouter)
    .use(`/api/${AppConfig.version}/login`, loginRouter)
    .use(`/api/${AppConfig.version}/ellowRecruiter`, ellowRecruiterRouter)

export default router;
