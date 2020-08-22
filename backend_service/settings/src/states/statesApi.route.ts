import { getStatesList } from './statesApi.controller';
import * as express from 'express';
const router = express.Router();
router
    .get('/', getStatesList)
export default router;
