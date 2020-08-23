import AppConfig from './config/config';
import hiringStepsRouter from './hiringSteps/hiringSteps.route';
import preferencesRouter from './preferences/preferences.route';
import certificateRouter from './certificate/certificate.route';
import ServicesRouter from './services/ServicesRoute';
import DomainsRouter from './domains/DomainsRoute';
import TechnologyAreaRouter from './technologyAreas/TechnologyAreaRoute';
import SkillsRouter from './skills/SkillsRoute';
import countryRouter from './countries/countryApi.route'
import stateRouter from './states/statesApi.route'
import jobCategoryRouter from './jobCategory/jobCategory.route'

import * as express from 'express';
const router = express.Router();

router
    .use(`/api/${AppConfig.version}/settings/hiringSteps`, hiringStepsRouter)
    .use(`/api/${AppConfig.version}/settings/preferences`, preferencesRouter)
    .use(`/api/${AppConfig.version}/settings/certificate`, certificateRouter)
    .use(`/api/${AppConfig.version}/settings/services`, ServicesRouter)
    .use(`/api/${AppConfig.version}/settings/domains`, DomainsRouter)
    .use(`/api/${AppConfig.version}/settings/technologyAreas`, TechnologyAreaRouter)
    .use(`/api/${AppConfig.version}/settings/skills`, SkillsRouter)
    .use(`/api/${AppConfig.version}/settings/countries`, countryRouter)
    .use(`/api/${AppConfig.version}/settings/states`, stateRouter)
    .use(`/api/${AppConfig.version}/settings/jobCategory`, jobCategoryRouter)

export default router;



