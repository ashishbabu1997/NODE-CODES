import * as employeeController from './employee.controller';
 import * as express from 'express';
 import validate from './middleware/validation';
 import {companyRegistrationSchema,freelancerSchema,tokenSchema} from './schema/create.schema';
 import { jwtAuth } from './middleware/jwtAuthenticate';
 import setData from './middleware/setData';
 import setProfileAuth from './middleware/setProfileAuth';

const router = express.Router();

router
    .post('/', validate(companyRegistrationSchema), employeeController.addEmployee)
    .post('/freelancer', validate(freelancerSchema), employeeController.addFreelancer)
    .post('/freelancer/setTokenAndPassword', validate(tokenSchema), employeeController.resetToken)
    .get('/getCompanyByEmail', employeeController.getCompanyByEmail)
    .post('/addEmployeeByAdmin',jwtAuth, setData(),setProfileAuth([1]), validate(companyRegistrationSchema), employeeController.addEmployeeByAdmin)
    .get('/verifyToken', employeeController.checkVerificationLink)
    .post('/ellowRecruiterSignup',employeeController.ellowRecruiterSignup)
    .put('/editRecruiterDetails',jwtAuth, setData(),employeeController.ellowRecruiterSignup)
    .get('/getAllAdmins', employeeController.getellowAdminsDetails)
    .get('/getAllAdminsAndHirers', employeeController.getellowAdminsHirers)
    .get('/getEmployees',jwtAuth, setData(), employeeController.getEmployeesFromCompany)
    .get('/switchUser', jwtAuth, setData(), employeeController.switchUserController)

export default router;