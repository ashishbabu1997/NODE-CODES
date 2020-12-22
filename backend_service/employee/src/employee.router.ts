import { addEmployee,addEmployeeByAdmin,resetToken,addFreelancer,getCompanyByEmail,checkVerificationLink,ellowRecruiterSignup,getellowAdminsDetails } from './employee.controller';
 import * as express from 'express';
 import validate from './middleware/validation';
 import {companyRegistrationSchema,freelancerSchema,tokenSchema} from './schema/create.schema';
 import { jwtAuth } from './middleware/jwtAuthenticate';
 import setData from './middleware/setData';

const router = express.Router();

router
    .post('/', validate(companyRegistrationSchema), addEmployee)
    .post('/freelancer', validate(freelancerSchema), addFreelancer)
    .post('/freelancer/setTokenAndPassword', validate(tokenSchema), resetToken)
    .get('/getCompanyByEmail', getCompanyByEmail)
    .post('/addEmployeeByAdmin',jwtAuth, setData(), validate(companyRegistrationSchema), addEmployeeByAdmin)
    .get('/verifyToken', checkVerificationLink)
    .post('/ellowRecruiterSignup',ellowRecruiterSignup)
    .get('/getAllAdmins', getellowAdminsDetails)

    
    
export default router;

