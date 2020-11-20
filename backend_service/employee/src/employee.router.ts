import { addEmployee,addEmployeeByAdmin,addFreelancer,getCompanyByEmail } from './employee.controller';
 import * as express from 'express';
 import validate from './middleware/validation';
 import {companyRegistrationSchema,freelancerSchema,tokenSchema} from './schema/create.schema';
 import { jwtAuth } from './middleware/jwtAuthenticate';
 import setData from './middleware/setData';

const router = express.Router();

router
    .post('/', validate(companyRegistrationSchema), addEmployee)
    .post('/freelancer', validate(freelancerSchema), addFreelancer)
    .post('/resetFreelancerToken', validate(tokenSchema), addFreelancer)
    .get('/getCompanyByEmail', getCompanyByEmail)
    .post('/addEmployeeByAdmin',jwtAuth, setData(), validate(companyRegistrationSchema), addEmployeeByAdmin)
export default router;

