import AppConfig from './config/config';
import candidatesRouter from './candidates/candidates.route';
import freelancerRouter from './freelancer/freelancer.route';
import filterRouter from './filter/filter.route';
import hiringRouter from './hiring/hiring.route';


import * as express from 'express';

const router = express.Router();
router
    .use(`/api/${AppConfig.version}/candidates`,candidatesRouter)
    .use(`/api/${AppConfig.version}/freelancer`,freelancerRouter)
    .use(`/api/${AppConfig.version}/filter`,filterRouter)
    .use(`/api/${AppConfig.version}/hiring`,hiringRouter)

export default router;



