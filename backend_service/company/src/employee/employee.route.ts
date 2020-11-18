import { getEmployee, addEmployee,updateEmployee,getemployeeData} from './employee.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addEmployeeSchema from './schema/addEmployeeSchema';
import listEmployeeSchema from './schema/listEmployeeSchema';
import updateEmployeeSchema from './schema/updateEmployeeSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';

const router = express.Router();

router
    .get('/', jwtAuth, setData(), validate(listEmployeeSchema), getEmployee)
    .post('/', jwtAuth, setData(), validate(addEmployeeSchema), addEmployee)
    .put('/', jwtAuth, setData(),validate(updateEmployeeSchema), updateEmployee)
    .get('/userDetails',jwtAuth, setData(), getemployeeData)

export default router;

