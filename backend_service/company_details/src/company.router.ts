import { getDetails } from './company.controller';
 import * as express from 'express';
const router = express.Router();
router
    .post('/get-details',getDetails)
export default router;