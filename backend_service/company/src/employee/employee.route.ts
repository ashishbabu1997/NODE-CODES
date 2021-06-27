import * as employeeController from './employee.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addEmployeeSchema from './schema/addEmployeeSchema';
import listEmployeeSchema from './schema/listEmployeeSchema';
import updateEmployeeSchema from './schema/updateEmployeeSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
import setProfileAuth from '../middlewares/setProfileAuth';

const router = express.Router();

router
    .get('/', jwtAuth, setData(),setProfileAuth([1,2,3]), validate(listEmployeeSchema), employeeController.getEmployee)
    .post('/', jwtAuth, setData(), validate(addEmployeeSchema), employeeController.addEmployee)
    .put('/', jwtAuth, setData(),validate(updateEmployeeSchema), employeeController.updateEmployee)
    .get('/userDetails',jwtAuth, setData(), employeeController.getemployeeData)
    .put('/updateActiveStatus',jwtAuth, setData(), employeeController.toggleEmployeeActiveStatus)
    .put('/setPrimaryContact',jwtAuth, setData(), employeeController.setAsPrimaryContact)
export default router;

