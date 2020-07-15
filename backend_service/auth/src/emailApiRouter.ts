import AppConfig from './config/config';
import emailRouter from './email_api/emailApi.route';
import * as  express from 'express';
const router = express.Router();
router
    .use(`/api/${AppConfig.version}/email_signup`, emailRouter)
 
export default router;