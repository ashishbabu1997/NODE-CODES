import { getEmployee, addEmployee } from './employee.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addEmployeeSchema from './schema/addEmployeeSchema';
import listEmployeeSchema from './schema/listEmployeeSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';

const router = express.Router();

router
    .get('/', jwtAuth, setData(), validate(listEmployeeSchema), getEmployee)
    .post('/', jwtAuth, setData(), validate(addEmployeeSchema), addEmployee)

export default router;

