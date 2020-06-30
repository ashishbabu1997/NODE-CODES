
import * as express from 'express';
import * as signup from "./email_api.controller"
const router = express.Router();
router
.post('/email_signup',signup.getEmail)

export default router;