import { getEmployee, addEmployee } from './employee.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addEmployeeSchema from './schema/addEmployeeSchema';
import listEmployeeSchema from './schema/listEmployeeSchema';

const router = express.Router();

router
    .get('/:companyId', validate(listEmployeeSchema), getEmployee)
    .post('/',validate(addEmployeeSchema), addEmployee)

export default router;

