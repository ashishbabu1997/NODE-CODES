import AppConfig from './config/config';
import locationRouter from './locations/locations.route';
import * as express from 'express';
const router = express.Router();

router
    .use(`/api/${AppConfig.version}/company/locations`, locationRouter);

export default router;



