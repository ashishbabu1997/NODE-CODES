import AppConfig from './config/config';
import locationRouter from './locations/locations.route';
import serviceRouter from './services/services.route';
import * as express from 'express';
const router = express.Router();

router
    .use(`/api/${AppConfig.version}/company/locations`, locationRouter)
    .use(`/api/${AppConfig.version}/company/services`, serviceRouter);


export default router;



