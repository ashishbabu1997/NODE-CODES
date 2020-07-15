import AppConfig from './config/config';
import hiringStepsRouter from './hiringSteps/hiringSteps.route';
import * as express from 'express';
const router = express.Router();

router
    .use(`/api/${AppConfig.version}/settings/hiringSteps`,hiringStepsRouter)

export default router;



