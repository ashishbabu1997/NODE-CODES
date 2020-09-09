import AppConfig from './config/config';
import locationRouter from './locations/locations.route';
import serviceRouter from './services/services.route';
import certificationRouter from './certifications/certifications.route';
import employeeRouter from './employee/employee.route';
import companyProfileRouter from './profile/companyProfile.router'
import * as express from 'express';
import profilePercentageRouter from './profilePercentage/profilePercentage.route'
import personaProfileRouter from './personalProfile/personalProfile.route'
const router = express.Router();

router
    .use(`/api/${AppConfig.version}/company/locations`, locationRouter)
    .use(`/api/${AppConfig.version}/company/services`, serviceRouter)
    .use(`/api/${AppConfig.version}/company/certifications`, certificationRouter)
    .use(`/api/${AppConfig.version}/company/companyProfile`,companyProfileRouter)
    .use(`/api/${AppConfig.version}/company/employee`, employeeRouter)
    .use(`/api/${AppConfig.version}/company/profilePercentage`, profilePercentageRouter)
    .use(`/api/${AppConfig.version}/company/perdonalProfile`, personaProfileRouter);



export default router;



