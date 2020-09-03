import { listUsers,userDetails,adminPanel } from './admin.controller';
import * as express from 'express';
const router = express.Router();
router
    .get('/listUsers',listUsers)
    .get('/userDetails',userDetails)
    .post('/userStatus',adminPanel)
export default router;
