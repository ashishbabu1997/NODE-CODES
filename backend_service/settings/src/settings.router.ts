import AppConfig from './config/config';
import preferencesRouter from './preferences/preferences.route';
import certificateRouter from './certificate/certificate.route';
import ServicesRouter from './services/ServicesRoute';
import DomainsRouter from './domains/DomainsRoute';
import TechnologyAreaRouter from './technologyAreas/TechnologyAreaRoute';
import SkillsRouter from './skills/SkillsRoute';
import countryRouter from './countries/countryApi.route'
import stateRouter from './states/statesApi.route'
import jobCategoryRouter from './jobCategory/jobCategory.route'
import assessmentTraitRouter from './assessmentTraits/assessmentTraitsRoute';
import languageRouter from './languages/languageApi.route';
import cloudRouter from './cloudproficiency/CloudProficiencyRoute';
import designationsRouter from './designations/designations.route';



import * as express from 'express';
const router = express.Router();

router
    .use(`/api/${AppConfig.version}/settings/preferences`, preferencesRouter)
    .use(`/api/${AppConfig.version}/settings/certificate`, certificateRouter)
    .use(`/api/${AppConfig.version}/settings/services`, ServicesRouter)
    .use(`/api/${AppConfig.version}/settings/domains`, DomainsRouter)
    .use(`/api/${AppConfig.version}/settings/technologyAreas`, TechnologyAreaRouter)
    .use(`/api/${AppConfig.version}/settings/skills`, SkillsRouter)
    .use(`/api/${AppConfig.version}/settings/countries`, countryRouter)
    .use(`/api/${AppConfig.version}/settings/states`, stateRouter)
    .use(`/api/${AppConfig.version}/settings/jobCategory`, jobCategoryRouter)
    .use(`/api/${AppConfig.version}/settings/assessmentTraits`, assessmentTraitRouter)
    .use(`/api/${AppConfig.version}/settings/languages`, languageRouter)
    .use(`/api/${AppConfig.version}/settings/cloudproficiency`, cloudRouter)
    .use(`/api/${AppConfig.version}/settings/designations`, designationsRouter)

export default router;



