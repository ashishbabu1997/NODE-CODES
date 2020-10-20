import { addEmployee,addEmployeeByAdmin,getCompanyByEmail } from './employee.controller';
 import * as express from 'express';
 import validate from './middleware/validation';
 import createSchema from './schema/create.schema';
 import { jwtAuth } from './middleware/jwtAuthenticate';
 import setData from './middleware/setData';
const router = express.Router();

router
    .post('/', validate(createSchema), addEmployee)
    .get('/getCompanyByEmail', getCompanyByEmail)
    .post('/addEmployeeByAdmin',jwtAuth, setData(), validate(createSchema), addEmployeeByAdmin)
export default router;

