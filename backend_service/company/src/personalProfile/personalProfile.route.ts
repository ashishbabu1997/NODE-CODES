import { getProfile } from './personalProfile.controller';
import * as express from 'express';
const router = express.Router();
router
    .get('/', getProfile)

export default router;