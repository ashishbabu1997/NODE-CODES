import { create } from './employee.controller';
 import * as express from 'express';
 import validate from './middleware/validation';
 import createSchema from './schema/create.schema';

const router = express.Router();

router
    .post('/create', validate(createSchema), create)

export default router;