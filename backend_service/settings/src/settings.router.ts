import AppConfig from './config/config';
import hiringStepsRouter from './hiringSteps/hiringSteps.route';
import preferencesRouter from './preferences/preferences.route';
import certificateRouter from './certificate/certificate.route';
import * as express from 'express';
const router = express.Router();

router
    .use(`/api/${AppConfig.version}/settings/hiringSteps`, hiringStepsRouter)
    .use(`/api/${AppConfig.version}/settings/preferences`, preferencesRouter)
    .use(`/api/${AppConfig.version}/settings/certificate`, certificateRouter)

export default router;



