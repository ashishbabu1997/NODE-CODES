import AppConfig from './config/config';
import positionsRouter from './positions/positions.route';
import jobReceivedRouter from './jobreceived/jobreceived.router';
import filterRouter from './filter/filter.router';

import * as express from 'express';
const router = express.Router();

router
    .use(`/api/${AppConfig.version}/jobs/positions`, positionsRouter)
    .use(`/api/${AppConfig.version}/jobs/jobreceived`, jobReceivedRouter)
    .use(`/api/${AppConfig.version}/jobs/filter`, filterRouter)
export default router;



