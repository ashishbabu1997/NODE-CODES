import { addEmployee,getCompanyByEmail } from './employee.controller';
 import * as express from 'express';
 import validate from './middleware/validation';
 import createSchema from './schema/create.schema';

const router = express.Router();

router
    .post('/', validate(createSchema), addEmployee)
    .get('/getCompanyByEmail', getCompanyByEmail)

export default router;

