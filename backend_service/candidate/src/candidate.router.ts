import AppConfig from './config/config';
import candidatesRouter from './candidates/candidates.route';
import freelancerRouter from './freelancer/freelancer.route';
import filterRouter from './filter/filter.route';

import * as express from 'express';

const router = express.Router();
router
    .use(`/api/${AppConfig.version}/candidates`,candidatesRouter)
    .use(`/api/${AppConfig.version}/freelancer`,freelancerRouter)
    .use(`/api/${AppConfig.version}/filter`,filterRouter)
export default router;



