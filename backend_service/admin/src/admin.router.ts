import AppConfig from './config/config';
import adminRouter from './admins/admin.route';
import * as express from 'express';
const router = express.Router();
router
    .use(`/api/${AppConfig.version}/admin`,adminRouter)
export default router;
