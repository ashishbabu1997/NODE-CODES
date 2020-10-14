import { getCountriesList } from './countryApi.controller';
import * as express from 'express';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();
router
    .get('/', getCountriesList)
export default router;
