import { getCountriesList } from './countryApi.controller';
import * as express from 'express';
const router = express.Router();
router
    .get('/', getCountriesList)
export default router;
