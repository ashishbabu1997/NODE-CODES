import AppConfig from './config/config';
import candidatesRouter from './candidates/candidates.route';
import * as express from 'express';
const router = express.Router();
router
    .use(`/api/${AppConfig.version}/candidates/candidateDetails`,candidatesRouter)
    .use(`/api/${AppConfig.version}/candidates/listCandidates`,candidatesRouter)

export default router;


