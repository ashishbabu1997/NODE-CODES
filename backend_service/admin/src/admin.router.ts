import AppConfig from './config/config';
import adminRouter from './admins/admin.route';
import notificationRouter from './notifications/notifications.route';
import * as express from 'express';
const router = express.Router();
router
    .use(`/api/${AppConfig.version}/admin`,adminRouter)
    .use(`/api/${AppConfig.version}/notifications`,notificationRouter)
export default router;
