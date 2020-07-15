import AppConfig from './config/config';
import locationRouter from './locations/locations.route';
import serviceRouter from './services/services.route';
import certificationRouter from './certifications/certifications.route';
import employeeRouter from './employee/employee.route';
import * as express from 'express';
const router = express.Router();

router
    .use(`/api/${AppConfig.version}/company/locations`, locationRouter)
    .use(`/api/${AppConfig.version}/company/services`, serviceRouter)
    .use(`/api/${AppConfig.version}/company/certifications`, certificationRouter)
    .use(`/api/${AppConfig.version}/company/employee`, employeeRouter);

export default router;



