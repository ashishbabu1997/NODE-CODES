import * as express from 'express';
import { employeeLogin } from "./EmployeeLoginController"
import validate from '../middlewares/joiValidation';
import otpValidateSchema from './schemas/otpValidateSchema';
const router = express.Router();
router
    .post('/', employeeLogin);
export default router;