import { listUsers } from './admin.controller';
import * as express from 'express';
const router = express.Router();
router
    .get('/listUsers',listUsers)
export default router;
