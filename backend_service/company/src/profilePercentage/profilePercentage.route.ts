import { getProfilePercentage } from './profilePercentage.controller';
import * as express from 'express';
const router = express.Router();
router
    .get('/:companyId',getProfilePercentage)
export default router;