import { getLanguagesList,flushLanguagesListCache } from './languageApi.controller';
import * as express from 'express';
const router = express.Router();
router
    .get('/', getLanguagesList)
    .get('/flushCache',flushLanguagesListCache)
export default router;