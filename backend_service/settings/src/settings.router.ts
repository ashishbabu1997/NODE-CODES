import AppConfig from './config/config';
import hiringStepsRouter from './hiringSteps/hiringSteps.route';
import preferencesRouter from './preferences/preferences.route';
import * as express from 'express';
const router = express.Router();

router
    .use(`/api/${AppConfig.version}/settings/hiringSteps`, hiringStepsRouter)
    .use(`/api/${AppConfig.version}/settings/preferences`, preferencesRouter)

export default router;



