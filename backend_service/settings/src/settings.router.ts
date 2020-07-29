import AppConfig from './config/config';
import hiringStepsRouter from './hiringSteps/hiringSteps.route';
import preferencesRouter from './preferences/preferences.route';
import certificateRouter from './certificate/certificate.route';
import ServicesRouter from './services/ServicesRoute';
import DomainsRouter from './domains/DomainsRoute';
import TechnologyAreaRouter from './technologyAreas/TechnologyAreaRoute';

import * as express from 'express';
const router = express.Router();

router
    .use(`/api/${AppConfig.version}/settings/hiringSteps`, hiringStepsRouter)
    .use(`/api/${AppConfig.version}/settings/preferences`, preferencesRouter)
    .use(`/api/${AppConfig.version}/settings/certificate`, certificateRouter)
    .use(`/api/${AppConfig.version}/settings/services`, ServicesRouter)
    .use(`/api/${AppConfig.version}/settings/domains`, DomainsRouter)
    .use(`/api/${AppConfig.version}/settings/technologyAreas`, TechnologyAreaRouter)




export default router;



