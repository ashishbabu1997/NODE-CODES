import { listNotifications } from './notifications.controller';
import * as express from 'express';
const router = express.Router();
router.get('/', listNotifications);
export default router;
