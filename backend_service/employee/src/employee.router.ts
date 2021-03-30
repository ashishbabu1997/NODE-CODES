import { addEmployee,addEmployeeByAdmin,resetToken,addFreelancer,getCompanyByEmail,checkVerificationLink,ellowRecruiterSignup,getellowAdminsDetails,getEmployeesFromCompany } from './employee.controller';
 import * as express from 'express';
 import validate from './middleware/validation';
 import {companyRegistrationSchema,freelancerSchema,tokenSchema} from './schema/create.schema';
 import { jwtAuth } from './middleware/jwtAuthenticate';
 import setData from './middleware/setData';
 import setProfileAuth from './middleware/setProfileAuth';

const router = express.Router();

router
    .post('/', validate(companyRegistrationSchema), addEmployee)
    .post('/freelancer', validate(freelancerSchema), addFreelancer)
    .post('/freelancer/setTokenAndPassword', validate(tokenSchema), resetToken)
    .get('/getCompanyByEmail', getCompanyByEmail)
    .post('/addEmployeeByAdmin',jwtAuth, setData(),setProfileAuth([1]), validate(companyRegistrationSchema), addEmployeeByAdmin)
    .get('/verifyToken', checkVerificationLink)
    .post('/ellowRecruiterSignup',ellowRecruiterSignup)
    .get('/getAllAdmins',setProfileAuth([1,2,3,4]), getellowAdminsDetails)
    .get('/getEmployees',jwtAuth, setData(), getEmployeesFromCompany)

    

    
    
export default router;

