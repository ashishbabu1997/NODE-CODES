import * as express from 'express';
import { employeeLogin } from "./EmployeeLoginController"
const router = express.Router();
router
    .post('/', employeeLogin);
export default router;