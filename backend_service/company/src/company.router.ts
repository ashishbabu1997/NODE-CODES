import AppConfig from './config/config';
import locationRouter from './locations/locations.route';
import companyProfileRouter from './companyProfile/companyProfile.router'
import * as express from 'express';
const router = express.Router();

router
    .use(`/api/${AppConfig.version}/company/locations`, locationRouter)
    .use(`/api/${AppConfig.version}/company/companyProfile`,companyProfileRouter);


export default router;



