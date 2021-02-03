import AppConfig from './config/config';
import positionsRouter from './positions/positions.route';
import jobReceivedRouter from './jobreceived/jobreceived.router';
import filterRouter from './filter/filter.router';
import dashboardRouter from './dashboard/dashboard.router';


import * as express from 'express';
const router = express.Router();

router
    .use(`/api/${AppConfig.version}/jobs/positions`, positionsRouter)
    .use(`/api/${AppConfig.version}/jobs/jobreceived`, jobReceivedRouter)
    .use(`/api/${AppConfig.version}/jobs/filter`, filterRouter)
    .use(`/api/${AppConfig.version}/jobs/dashboard`, dashboardRouter)
export default router;



