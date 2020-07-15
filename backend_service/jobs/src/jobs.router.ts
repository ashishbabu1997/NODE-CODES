import AppConfig from './config/config';
import positionsRouter from './positions/positions.route';
import * as express from 'express';
const router = express.Router();

router
    .use(`/api/${AppConfig.version}/jobs/positions`, positionsRouter)

export default router;



